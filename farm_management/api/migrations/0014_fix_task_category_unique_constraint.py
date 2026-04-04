# Fix unique constraint on task_categories table

from django.db import migrations


def drop_and_recreate_unique_index(apps, schema_editor):
    """Drop the wrong unique index on 'name' and create correct one on (admin_id, name)"""
    # Raw SQL to drop the wrong unique index
    schema_editor.execute(
        "ALTER TABLE `task_categories` DROP INDEX `name`"
    )


def reverse_fix(apps, schema_editor):
    """Reverse the constraint fix"""
    schema_editor.execute(
        "ALTER TABLE `task_categories` ADD UNIQUE KEY `name` (`name`)"
    )


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('api', '0013_cleanup_orphaned_tasks_and_require_admin'),
    ]

    operations = [
        migrations.RunPython(drop_and_recreate_unique_index, reverse_fix),
    ]
