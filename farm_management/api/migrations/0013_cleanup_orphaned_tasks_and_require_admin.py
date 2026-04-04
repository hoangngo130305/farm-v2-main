# Generated migration: Clean up orphaned tasks/categories and enforce admin requirement

from django.db import migrations, models
import django.db.models.deletion


def cleanup_orphaned_tasks(apps, schema_editor):
    """Delete tasks and categories without admin_id before enforcing NOT NULL constraint"""
    Task = apps.get_model('api', 'Task')
    TaskCategory = apps.get_model('api', 'TaskCategory')
    
    # Delete tasks with no admin assigned
    orphaned_tasks = Task.objects.filter(admin__isnull=True)
    task_count = orphaned_tasks.count()
    if task_count > 0:
        print(f"Deleting {task_count} orphaned task(s) without admin assignment")
        orphaned_tasks.delete()
    
    # Delete task categories with no admin assigned  
    orphaned_categories = TaskCategory.objects.filter(admin__isnull=True)
    category_count = orphaned_categories.count()
    if category_count > 0:
        print(f"Deleting {category_count} orphaned task categor(ies) without admin assignment")
        orphaned_categories.delete()


def reverse_cleanup(apps, schema_editor):
    """Reverse function - data cannot be restored"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_plantingzone_admin_task_admin_taskcategory_admin_and_more'),
    ]

    operations = [
        # First, delete orphaned records without admin assignment
        migrations.RunPython(cleanup_orphaned_tasks, reverse_cleanup),
        
        # Then, alter admin fields to NOT NULL to enforce admin assignment requirement
        migrations.AlterField(
            model_name='task',
            name='admin',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='tasks',
                to='api.admin'
            ),
        ),
        migrations.AlterField(
            model_name='taskcategory',
            name='admin',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='task_categories',
                to='api.admin'
            ),
        ),
    ]
