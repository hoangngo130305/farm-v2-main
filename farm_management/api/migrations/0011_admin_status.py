# Generated migration to add status field to Admin model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_merge_0007_material_status_0009_add_admin_to_farmer'),
    ]

    operations = [
        migrations.AddField(
            model_name='admin',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Dang tham dinh'),
                    ('approved', 'Da phe duyet'),
                    ('rejected', 'Tu choi'),
                ],
                default='pending',
                max_length=20,
            ),
        ),
    ]
