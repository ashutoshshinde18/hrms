from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Attendance, AttendanceAdjustment
from .serializers import AttendanceAdjustmentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg
from datetime import datetime, timedelta
import requests
import logging
logger = logging.getLogger(__name__)
# Create your views here.

class ClockInOutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_time_difference(self, start_time, end_time):
        start_dt = datetime.combine(datetime.today(), start_time)
        end_dt = datetime.combine(datetime.today(), end_time)
        return end_dt - start_dt

    def get_address_from_location(self, latitude, longitude):
        try:
            google_api_key = "AIzaSyAVuj9Zdv2jsjCGs44j9PeVWwhMDormFk8"
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={google_api_key}"
            response = requests.get(geocode_url)
            data = response.json()
            if data["status"] == "OK" and data["results"]:
                return data["results"][0]["formatted_address"]
            return "Address not found"
        except Exception as e:
            return "Error fetching address"
        
    def get(self, request):
        user = request.user
        today = datetime.now().date()

        try:
            attendance = Attendance.objects.get(user=user, date=today)
            return Response({
                "is_clocked_in": attendance.clock_in_time is not None and attendance.clock_out_time is None,
                "start_time": attendance.clock_in_time,
                "end_time": attendance.clock_out_time
            })
        except Attendance.DoesNotExist:
            return Response({
                "is_clocked_in": False,
                "start_time": None
            })

    def post(self, request):
        user = request.user
        logger.info(f"request user: {request.user}")
        clock_action = request.data.get("action")
        location = request.data.get("location")
        logger.info(f"clock action: {clock_action} and location: {location}")

        if not location or "latitude" not in location or "longitude" not in location:
            return Response({
                "error": "Location data (latitude,longitude) is required"
            })
        
        latitude = location["latitude"]
        longitude = location["longitude"]
        address = self.get_address_from_location(latitude, longitude)

        today = datetime.now().date()
        attendance, created = Attendance.objects.get_or_create(user=user, date=today)
        logger.info(f"Attendance object found: {attendance}")

        if clock_action == "clock_in":
            if attendance.clock_in_time:
                return Response({"error": "You have already clocked in today."}, status=400)
            attendance.clock_in_time = datetime.now().time()
            attendance.location["clock_in"] = {
                "latitude": latitude,
                "longitude": longitude,
                "address": address,
            }
        elif clock_action == "clock_out":
            if not attendance.clock_in_time:
                return Response({"error": "You need to clock in before clocking out."}, status=400)
            attendance.clock_out_time = datetime.now().time()
            if attendance.clock_in_time:
                time_diff = self.get_time_difference(attendance.clock_in_time, attendance.clock_out_time)
                attendance.avg_hours_per_day = time_diff
            attendance.location["clock_out"] = {
                "latitude": latitude,
                "longitude": longitude,
                "address": address,
            }
        else:
            return Response({"error": "Invalid action"}, status=400)
        
        attendance.save()
        return Response({"message": f"Successfully {clock_action.replace('_', ' ')}.", "address": address})


class AttendanceStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        start_date = request.query_params.get("start_date")
        logger.info(f"start date 1: {start_date}")
        end_date = request.query_params.get("end_date")

        if not start_date or not end_date:
            return Response({"error": "Start and end dates are required."}, status=400)

        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            logger.info(f"start date 2: {start_date}")
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

            records = Attendance.objects.filter(
                user=user, date__range=[start_date, end_date]
            )
            logger.info(f"Records found: {records}")
            total_days = records.count()
            logger.info(f"Total days: {total_days}")
            avg_hours = records.aggregate(avg_duration=Avg("avg_hours_per_day"))["avg_duration"]
            logger.info(f"Avg hours per day: {avg_hours}")

            # Convert the avg_duration to hours and minutes if it exists
            avg_hours_hm = None
            if avg_hours:
                # Handle avg_hours as timedelta or a float (if in seconds)
                if isinstance(avg_hours, timedelta):
                    total_seconds = avg_hours.total_seconds()
                else:  # Assume float in seconds
                    total_seconds = avg_hours

                avg_hours_hm = {
                    "hours": int(total_seconds // 3600),
                    "minutes": int((total_seconds % 3600) // 60),
                }
            logger.info(f"Processed avg_hours_hm: {avg_hours_hm}")
            return Response({
                "total_days": total_days,
                "avg_hours_per_day": avg_hours_hm
            })
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
class AttendanceLogsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        attendance_logs = Attendance.objects.filter(user=user).values(
            'date',
            'location',
            'clock_in_time',
            'clock_out_time',
            'avg_hours_per_day'
        )

        logs = []
        for log in attendance_logs:
            duration = log['avg_hours_per_day']
            logs.append({
                "date": log['date'].strftime("%b %d, %a"),
                "location": log['location'],
                "clockIn": log['clock_in_time'].strftime("%I:%M %p") if log['clock_in_time'] else None,
                "clockOut": log['clock_out_time'].strftime("%I:%M %p") if log['clock_out_time'] else None,
                "duration": f"{duration.seconds // 3600}h {(duration.seconds % 3600) // 60}m" if duration else "0h 0m",
                "needsRegularization": not log['clock_in_time'] or not log['clock_out_time']
            })
        logger.info(f"Attendance Logs: {logs}")
        return Response({"attendance_logs": logs})

class AttendanceRegularizeAPIView(APIView):
    def post(self, request):
        required_date_str = request.data.get('date')
        clock_out_time = request.data.get('clock_out_time')
        note = request.data.get('note')
        user = request.user

        if not clock_out_time or not note:
            return Response({"error": "Both clock-out time and note are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            required_date = datetime.strptime(required_date_str, "%b %d, %a").replace(year=datetime.today().year).date()
            logger.info(f"required date for regularisation: {required_date}")
            attendance = Attendance.objects.get(user=user, date=required_date)
            logger.info(f"attendance output: {attendance}")
        except Attendance.DoesNotExist:
            return Response({"error": "Attendance not found for the selected date."}, status=status.HTTP_404_NOT_FOUND)

        attendance_adjustment = AttendanceAdjustment.objects.create(
            attendance=attendance,
            regularise_status="Pending",
            regularise_note=note,
        )

        serializer = AttendanceAdjustmentSerializer(attendance_adjustment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)