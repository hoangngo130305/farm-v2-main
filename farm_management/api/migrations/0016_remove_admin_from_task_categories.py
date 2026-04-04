# Migration: Remove admin_id from task_categories - make categories global, tasks remain per-admin

from django.db import migrations, models


def remove_admin_from_categories(apps, schema_editor):
    """Remove admin association from task_categories"""
    # Categories become global, so we keep the data but remove admin_id
    TaskCategory = apps.get_model('api', 'TaskCategory')
    
    # Get unique category names
    unique_names = TaskCategory.objects.values_list('name', flat=True).distinct()
    
    # Delete duplicates, keep only one of each category name
    for name in unique_names:
        categories = TaskCategory.objects.filter(name=name).order_by('id')
        # Keep the first one, delete the rest
        to_delete = categories[1:]
        for cat in to_delete:
            cat.delete()
        print(f"Cleaned up duplicates for category: {name}")


def reverse_cleanup(apps, schema_editor):
    """Reverse function - data already deleted"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_add_default_task_categories'),
    ]

    operations = [
        # Clean up duplicate categories before removing admin_id
        migrations.RunPython(remove_admin_from_categories, reverse_cleanup),
        
        # Remove admin field from TaskCategory model
        migrations.RemoveField(
            model_name='taskcategory',
            name='admin',
        ),
    ]
