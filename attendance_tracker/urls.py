from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('clock-in-out/', views.ClockInOutAPIView.as_view(), name="clock_in_out"),
    path('stats/', views.AttendanceStatsAPIView.as_view(), name="stats"),
    path('logs/', views.AttendanceLogsAPIView.as_view(), name="attendance_logs"),
    path('regularize/', views.AttendanceRegularizeAPIView.as_view(), name="attendance_regularize")
]
