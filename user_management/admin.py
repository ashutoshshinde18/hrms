from django.contrib import admin
from .models import Client, CustomUser, OAuth2Token, Role, UserRole

# Inline for viewing user roles within the user detail page
class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 0
    readonly_fields = ('role', 'assigned_at', 'assigned_by', 'is_active', 'notes')
    fk_name = 'user' # Specify the ForeignKey to use


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'is_active', 'created_at', 'updated_at')
    search_fields = ('name', 'email', 'phone_number')
    list_filter = ('is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('name', 'email', 'phone_number', 'address', 'is_active')}),
        ('Additional Info', {'fields': ('notes', 'created_by')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'email',
        'client',
        'role',
        'is_email_verified',
        'is_active',
        'created_at',
        'updated_at'
    )
    search_fields = ('email', 'phone_number', 'client__name')
    list_filter = ('role', 'client', 'is_email_verified', 'is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at', 'email_verification_code', 'email_verification_sent_at')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'client', 'role', 'phone_number', 'date_of_birth', 'profile_picture')}),
        ('Verification', {
            'fields': (
                'is_email_verified',
                'email_verification_code',
                'email_verification_sent_at',
                'password_reset_code',
                'password_reset_sent_at'
            )
        }),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active')}),
        ('Audit Info', {'fields': ('created_by', 'updated_by')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    inlines = [UserRoleInline]


@admin.register(OAuth2Token)
class OAuth2TokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'access_token', 'refresh_token', 'expires_in', 'last_refreshed_at', 'is_active')
    search_fields = ('user__email',)
    list_filter = ('is_active', 'expires_in', 'last_refreshed_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('user', 'access_token', 'refresh_token', 'expires_in', 'is_active')}),
        ('Timestamps', {'fields': ('last_refreshed_at', 'created_at', 'updated_at')}),
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('permissions',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('name', 'description', 'permissions')}),
        ('Audit Info', {'fields': ('created_by',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'assigned_at', 'assigned_by', 'is_active')
    search_fields = ('user__email', 'role__name', 'assigned_by__email')
    list_filter = ('role', 'is_active', 'assigned_at')
    readonly_fields = ('assigned_at', 'assigned_by')
    fieldsets = (
        (None, {'fields': ('user', 'role', 'is_active')}),
        ('Assignment Details', {'fields': ('assigned_by', 'assigned_at', 'notes')}),
    )
