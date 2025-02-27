from rest_framework import serializers
from .models import AttendanceAdjustment
from .models import Attendance

class AttendanceAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceAdjustment
        fields = ['attendance', 'adjustment_timestamp', 'regularise_status', 'regularise_note', 'approved_by']

    # You can also validate the note if necessary
    def validate_regularise_note(self, value):
        if not value:
            raise serializers.ValidationError("Note is required for regularization.")
        return value
