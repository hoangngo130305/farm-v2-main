#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farm_management.settings')
django.setup()

from api.models import TaskIcon

def seed_icons():
    icons_data = [
        {
            "name": "Rửa vườn",
            "icon_name": "Droplets",
            "color_variants": ["bg-blue-100", "text-blue-600"],
            "description": "Rửa sạch vườn"
        },
        {
            "name": "Cắt tỉa cành",
            "icon_name": "Scissors",
            "color_variants": ["bg-gray-100", "text-gray-600"],
            "description": "Cắt tỉa cành cây"
        },
        {
            "name": "Làm sạch cỏ",
            "icon_name": "Leaf",
            "color_variants": ["bg-green-100", "text-green-600"],
            "description": "Làm sạch cỏ dại"
        },
        {
            "name": "Tưới nước",
            "icon_name": "CloudRain",
            "color_variants": ["bg-cyan-100", "text-cyan-600"],
            "description": "Tưới nước cây"
        },
        {
            "name": "Bón phân vi sinh",
            "icon_name": "Sprout",
            "color_variants": ["bg-lime-100", "text-lime-600"],
            "description": "Bón phân vi sinh"
        },
        {
            "name": "Bón phân",
            "icon_name": "FlaskConical",
            "color_variants": ["bg-orange-100", "text-orange-600"],
            "description": "Bón phân hóa học"
        },
        {
            "name": "Phun sâu/rầy",
            "icon_name": "BugOff",
            "color_variants": ["bg-red-100", "text-red-600"],
            "description": "Phun thuốc sâu"
        },
        {
            "name": "Phun nhện đỏ",
            "icon_name": "SprayCan",
            "color_variants": ["bg-purple-100", "text-purple-600"],
            "description": "Phun nhện đỏ"
        },
        {
            "name": "Đổ gốc",
            "icon_name": "TreePine",
            "color_variants": ["bg-emerald-100", "text-emerald-600"],
            "description": "Đổ gốc cây"
        },
        {
            "name": "Xử lý chất thải",
            "icon_name": "Trash2",
            "color_variants": ["bg-stone-100", "text-stone-600"],
            "description": "Xử lý chất thải"
        },
        {
            "name": "Quản lý vật tư",
            "icon_name": "Package",
            "color_variants": ["bg-indigo-100", "text-indigo-600"],
            "description": "Quản lý vật tư"
        },
        {
            "name": "Vệ sinh kho",
            "icon_name": "Warehouse",
            "color_variants": ["bg-teal-100", "text-teal-600"],
            "description": "Vệ sinh kho hàng"
        },
        {
            "name": "An toàn lao động",
            "icon_name": "HardHat",
            "color_variants": ["bg-yellow-100", "text-yellow-600"],
            "description": "An toàn lao động"
        },
    ]
    
    count = TaskIcon.objects.count()
    print(f"Current icons: {count}")
    
    if count == 0:
        print("Creating default icons...")
        for data in icons_data:
            TaskIcon.objects.create(**data)
        print(f"Created {TaskIcon.objects.count()} icons")
    else:
        icons = TaskIcon.objects.all()
        print("Existing icons:")
        for icon in icons:
            print(f"  - {icon.name} ({icon.icon_name})")

if __name__ == "__main__":
    seed_icons()
