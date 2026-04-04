# Generated migration: Add default task categories for all approved admins

from django.db import migrations


def add_task_categories(apps, schema_editor):
    """Add default task categories for admins 1, 8, 9, 13"""
    TaskCategory = apps.get_model('api', 'TaskCategory')
    Admin = apps.get_model('api', 'Admin')
    
    # Admin IDs to add categories for
    admin_ids = [1, 8, 9, 13]
    
    # Category names
    category_names = [
        "Chăm sóc cơ bản",
        "Phân bón & Dinh dưỡng",
        "Phòng trừ sâu bệnh",
        "Quản lý & Vệ sinh bảo hộ"
    ]
    
    for admin_id in admin_ids:
        try:
            admin = Admin.objects.get(id=admin_id)
            for category_name in category_names:
                # Check if category already exists for this admin
                exists = TaskCategory.objects.filter(
                    admin_id=admin_id,
                    name=category_name
                ).exists()
                
                if not exists:
                    TaskCategory.objects.create(
                        admin_id=admin_id,
                        name=category_name,
                        task_ids=[]
                    )
                    print(f"Created category '{category_name}' for admin {admin_id} ({admin.name})")
                else:
                    print(f"Category '{category_name}' already exists for admin {admin_id}")
        except Admin.DoesNotExist:
            print(f"Admin {admin_id} does not exist")


def reverse_task_categories(apps, schema_editor):
    """Remove added task categories"""
    TaskCategory = apps.get_model('api', 'TaskCategory')
    
    admin_ids = [1, 8, 9, 13]
    category_names = [
        "Chăm sóc cơ bản",
        "Phân bón & Dinh dưỡng",
        "Phòng trừ sâu bệnh",
        "Quản lý & Vệ sinh bảo hộ"
    ]
    
    for admin_id in admin_ids:
        for category_name in category_names:
            TaskCategory.objects.filter(
                admin_id=admin_id,
                name=category_name
            ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_fix_task_category_unique_constraint'),
    ]

    operations = [
        migrations.RunPython(
            add_task_categories,
            reverse_code=reverse_task_categories
        )
    ]
