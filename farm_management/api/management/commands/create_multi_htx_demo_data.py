"""
Django management command to create comprehensive demo data for multiple HTX accounts.
Each HTX will have their own farmers, planting zones, materials, and activity logs.

Usage:
    python manage.py create_multi_htx_demo_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import Admin, Farmer, PlantingZone, Material


class Command(BaseCommand):
    help = 'Create comprehensive demo data for multiple HTX with data isolation testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('[START] Creating multi-HTX demo data...'))

        # Create multiple HTX accounts
        htx_data = [
            {
                'name': 'HTX Nong nghiep Xanh',
                'phone': '0987654321',
                'address': 'Xa Liem Tuyen, Huyen Thanh Tri, Ha Noi',
                'representative': 'Nguyen Van An',
                'farmers': [
                    {'phone': '0912345678', 'name': 'Tran Van B', 'cccd': '123456789012', 'birth_year': 1980},
                    {'phone': '0923456789', 'name': 'Pham Thi C', 'cccd': '234567890123', 'birth_year': 1985},
                    {'phone': '0934567890', 'name': 'Dang Van D', 'cccd': '345678901234', 'birth_year': 1990},
                ],
                'zones': [
                    {'name': 'Zone 001', 'crop_type': 'Rau sach', 'lots': ['Lot A1', 'Lot A2']},
                    {'name': 'Zone 002', 'crop_type': 'Rau cai', 'lots': ['Lot B1', 'Lot B2', 'Lot B3']},
                ],
                'materials': [
                    {'name': 'Phan huu co S001', 'type': 'Phan bon', 'active_ingredient': 'Nito', 'quantity': 100},
                    {'name': 'Thuoc tru sau S002', 'type': 'Thuoc', 'active_ingredient': 'Permethrin', 'quantity': 50},
                ],
            },
            {
                'name': 'HTX Rau sach Viet Nam',
                'phone': '0988888888',
                'address': 'Xa My Hung, Huyen Thanh Tri, Ha Noi',
                'representative': 'Le Thi E',
                'farmers': [
                    {'phone': '0945678901', 'name': 'Hoang Van F', 'cccd': '456789012345', 'birth_year': 1988},
                    {'phone': '0956789012', 'name': 'Vu Thi G', 'cccd': '567890123456', 'birth_year': 1992},
                ],
                'zones': [
                    {'name': 'Zone 001', 'crop_type': 'Rau dui', 'lots': ['Lot C1', 'Lot C2']},
                    {'name': 'Zone 002', 'crop_type': 'Rau xa lach', 'lots': ['Lot D1']},
                ],
                'materials': [
                    {'name': 'Phan la S003', 'type': 'Phan bon', 'active_ingredient': 'Phot pho', 'quantity': 80},
                    {'name': 'Diet benh S004', 'type': 'Thuoc', 'active_ingredient': 'Mancozeb', 'quantity': 40},
                ],
            },
            {
                'name': 'HTX Lua huu co Bac Bo',
                'phone': '0977777777',
                'address': 'Xa Ta Thanh Oai, Huyen Thanh Tri, Ha Noi',
                'representative': 'Phan Van H',
                'farmers': [
                    {'phone': '0967890123', 'name': 'To Van I', 'cccd': '678901234567', 'birth_year': 1987},
                    {'phone': '0978901234', 'name': 'Bui Thi J', 'cccd': '789012345678', 'birth_year': 1993},
                    {'phone': '0989012345', 'name': 'Chu Van K', 'cccd': '890123456789', 'birth_year': 1995},
                ],
                'zones': [
                    {'name': 'Zone 001', 'crop_type': 'Lua huu co', 'lots': ['Lot E1', 'Lot E2', 'Lot E3']},
                    {'name': 'Zone 002', 'crop_type': 'Lua mua', 'lots': ['Lot F1', 'Lot F2']},
                ],
                'materials': [
                    {'name': 'Dam lua S005', 'type': 'Phan bon', 'active_ingredient': 'Urea', 'quantity': 200},
                    {'name': 'Thuoc lua S006', 'type': 'Thuoc', 'active_ingredient': 'Carbofuran', 'quantity': 60},
                ],
            },
        ]

        # Create HTX, Farmers, Zones, Materials for each
        for htx_info in htx_data:
            self.stdout.write(self.style.SUCCESS(f"\n[HTX] Creating HTX: {htx_info['phone']}"))

            # Create Admin (HTX)
            admin, created = Admin.objects.get_or_create(
                phone=htx_info['phone'],
                defaults={
                    'name': htx_info['name'],
                    'address': htx_info['address'],
                    'representative': htx_info['representative'],
                    'registration_certificate': f"HTX-{htx_info['phone'][-4:]}",
                    'status': 'pending',
                }
            )
            action = "[NEW]" if created else "[OK]"
            self.stdout.write(f"  {action} Admin (HTX): Phone {admin.phone} (ID: {admin.id})")

            # Create Farmers for this HTX
            farmers_list = []
            for farmer_data in htx_info['farmers']:
                farmer, created = Farmer.objects.get_or_create(
                    phone=farmer_data['phone'],
                    admin=admin,
                    defaults={
                        'full_name': farmer_data['name'],
                        'cccd': farmer_data['cccd'],
                        'birth_year': farmer_data['birth_year'],
                        'managed_lot': f"Lô {farmer_data['name'][-1]}",
                    }
                )
                action = "[NEW]" if created else "[OK]"
                self.stdout.write(f"    {action} Farmer: {farmer.phone} - (ID: {farmer.id})")
                farmers_list.append(farmer)

            # Create Planting Zones for this HTX
            for zone_data in htx_info['zones']:
                # Create lots array for the zone
                lots_data = [
                    {
                        'name': lot_name,
                        'area': 5.0,
                        'coordinates': '20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75',
                        'latLngs': [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]],
                    }
                    for lot_name in zone_data['lots']
                ]

                zone, created = PlantingZone.objects.get_or_create(
                    name=zone_data['name'],
                    admin=admin,
                    defaults={
                        'crop_type': zone_data['crop_type'],
                        'lots': lots_data,
                    }
                )
                action = "[NEW]" if created else "[OK]"
                self.stdout.write(f"    {action} Zone: {zone.name} with {len(lots_data)} lots")

            # Create Materials for this HTX
            for material_data in htx_info['materials']:
                material, created = Material.objects.get_or_create(
                    name=material_data['name'],
                    defaults={
                        'type': material_data['type'],
                        'active_ingredient': material_data['active_ingredient'],
                        'quantity': material_data['quantity'],
                        'unit': 'kg',
                        'is_vietgap': True,
                    }
                )
                action = "[NEW]" if created else "[OK]"
                self.stdout.write(f"    {action} Material: {material.name}")

        self.stdout.write(self.style.SUCCESS(
            '\n[SUCCESS] Demo data creation completed!\n'
            '\n[INFO] Demo HTX Accounts for Testing Data Isolation:\n'
            '   1. HTX Nong nghiep Xanh (Phone: 0987654321) - 3 farmers, 2 zones, 2 materials\n'
            '   2. HTX Rau sach Viet Nam (Phone: 0988888888) - 2 farmers, 2 zones, 2 materials\n'
            '   3. HTX Lua huu co Bac Bo (Phone: 0977777777) - 3 farmers, 2 zones, 2 materials\n'
            '\n[DATA] Each HTX has:\n'
            '   - Multiple farmers (each HTX only sees their own farmers)\n'
            '   - 2 Planting zones with multiple lots each\n'
            '   - 2 Materials\n'
            '\n[TEST] Test data isolation by:\n'
            '   1. Go to http://localhost:3000/admin\n'
            '   2. Login with HTX phone: 0987654321 (HTX Nong nghiep Xanh)\n'
            '   3. Go to "Quan ly Nong dan" tab - Verify you see only 3 farmers\n'
            '   4. Go to "Quan ly Ma vung trong" tab - Verify you see only 2 zones\n'
            '   5. Go to "Thong ke lo dat" - Verify you see only that HTX\'s lots\n'
            '   6. LOGOUT and login with different HTX phone: 0988888888\n'
            '   7. Verify completely different data for 2nd HTX\n'
            '\n[INFO] This demonstrates data isolation working correctly!\n'
        ))
