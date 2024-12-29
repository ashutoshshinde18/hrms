from rest_framework import serializers
from .models import CustomUser, PersonalInfo, ContactInfo, CompanyInfo, ProfessionalSummaryInfo, FinancialIdentityDetailsInfo, Achievements

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['is_active'] = False  # Users are inactive until email verification
        return CustomUser.objects.create_user(**validated_data)

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInfo
        fields = ['id', 'user', 'full_name', 'gender', 'date_of_birth']
        read_only_fields = ['user']
    
class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['id', 'user', 'mobile_number', 'email', 'emergency_contact']
        read_only_fields = ['user']

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = ['id', 'user', 'department', 'joining_date', 'reports_to']
        read_only_fields = ['user']

class ProfessionalSummaryInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSummaryInfo
        fields = ['id', 'user', 'summary']
        read_only_fields = ['user']

class FinancialIdentityDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialIdentityDetailsInfo
        fields = ['id', 'user', 'aadhaar_number', 'pan_number', 'bank_name', 'account_number', 'ifsc_code']
        read_only_fields = ['user']

class AchievementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = ['id', 'user', 'title', 'date_awarded']
        read_only_fields = ['user']
