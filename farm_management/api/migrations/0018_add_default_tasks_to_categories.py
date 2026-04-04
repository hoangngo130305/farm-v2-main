# Migration: Add default tasks to each category and remove "Quy trình canh tác"

from django.db import migrations


def create_default_tasks(apps, schema_editor):
    """Create default tasks for each category across all admins"""
    Task = apps.get_model('api', 'Task')
    TaskCategory = apps.get_model('api', 'TaskCategory')
    Admin = apps.get_model('api', 'Admin')
    
    # Define tasks for each category
    category_tasks = {
        "Chăm sóc cơ bản": [
            "Tưới nước",
            "Làm sạch cỏ",
            "Cắt tỉa cành",
            "Rửa vườn",
        ],
        "Phân bón & Dinh dưỡng": [
            "Bón phân vi sinh",
            "Bón phân Lân",
            "Bón phân NPK",
            "Đổ gốc",
        ],
        "Phòng trừ sâu bệnh": [
            "Sâu Rầy (Najat)",
            "Rầy xanh",
            "Phun Rệp",
            "Phun Nhện đỏ",
        ],
        "Quản lý & Vệ sinh bảo hộ": [
            "Xử lý chất thải",
            "Quản lý vật tư",
            "Vệ sinh kho",
            "An toàn lao động",
        ],
    }
    
    # Admin IDs to create tasks for
    admin_ids = [1, 8, 9, 13]
    
    # Create tasks for each admin
    for admin_id in admin_ids:
        try:
            admin = Admin.objects.get(id=admin_id)
            print(f"\nCreating tasks for Admin {admin_id} ({admin.name}):")
            
            for category_name, task_names in category_tasks.items():
                category = TaskCategory.objects.get(name=category_name)
                category_task_ids = category.task_ids or []
                
                for task_name in task_names:
                    # Check if task already exists for this admin
                    if Task.objects.filter(admin_id=admin_id, name=task_name).exists():
                        task = Task.objects.get(admin_id=admin_id, name=task_name)
                        print(f"  - Task already exists: {task_name} (ID: {task.id})")
                        # Add to category if not there
                        if task.id not in category_task_ids:
                            category_task_ids.append(task.id)
                    else:
                        # Create new task
                        task = Task.objects.create(
                            admin_id=admin_id,
                            name=task_name,
                            icon='Leaf',
                            color='bg-emerald-100 text-emerald-600',
                            requires_materials=True,
                            default_values={'task': task_name}
                        )
                        print(f"  ✓ Created task: {task_name} (ID: {task.id})")
                        category_task_ids.append(task.id)
                
                # Update category with task IDs
                category.task_ids = category_task_ids
                category.save()
                
        except Admin.DoesNotExist:
            print(f"Admin {admin_id} does not exist")
    
    # Delete "Quy trình canh tác" category if it exists
    try:
        quy_trinh_cat = TaskCategory.objects.get(name="Quy trình canh tác")
        print(f"\nDeleting category: Quy trình canh tác")
        quy_trinh_cat.delete()
    except TaskCategory.DoesNotExist:
        pass


def reverse_default_tasks(apps, schema_editor):
    """Remove created default tasks"""
    Task = apps.get_model('api', 'Task')
    TaskCategory = apps.get_model('api', 'TaskCategory')
    
    # Task names to remove
    all_task_names = [
        "Tưới nước", "Làm sạch cỏ", "Cắt tỉa cành", "Rửa vườn",
        "Bón phân vi sinh", "Bón phân Lân", "Bón phân NPK", "Đổ gốc",
        "Sâu Rầy (Najat)", "Rầy xanh", "Phun Rệp", "Phun Nhện đỏ",
        "Xử lý chất thải", "Quản lý vật tư", "Vệ sinh kho", "An toàn lao động",
    ]
    
    Task.objects.filter(name__in=all_task_names).delete()
    
    # Try to recreate "Quy trình canh tác" category
    try:
        TaskCategory.objects.get_or_create(
            name="Quy trình canh tác",
            defaults={'task_ids': []}
        )
    except:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_fix_task_unique_constraint'),
    ]

    operations = [
        migrations.RunPython(
            create_default_tasks,
            reverse_code=reverse_default_tasks
        )
    ]
