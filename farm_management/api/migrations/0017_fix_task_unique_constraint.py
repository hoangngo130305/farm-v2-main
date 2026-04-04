# Fix unique constraint on tasks table - should be on (admin_id, name) not just name

from django.db import migrations


def fix_unique_constraint(apps, schema_editor):
    """Drop wrong unique constraint and create correct one"""
    schema_editor.execute(
        "ALTER TABLE `tasks` DROP INDEX `name`"
    )
    # Create the correct unique constraint on (admin_id, name)
    schema_editor.execute(
        "ALTER TABLE `tasks` ADD UNIQUE KEY `tasks_admin_id_name` (`admin_id`, `name`)"
    )


def reverse_fix(apps, schema_editor):
    """Reverse the constraint fix"""
    schema_editor.execute(
        "ALTER TABLE `tasks` DROP INDEX `tasks_admin_id_name`"
    )
    schema_editor.execute(
        "ALTER TABLE `tasks` ADD UNIQUE KEY `name` (`name`)"
    )


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('api', '0016_remove_admin_from_task_categories'),
    ]

    operations = [
        migrations.RunPython(fix_unique_constraint, reverse_fix),
    ]
