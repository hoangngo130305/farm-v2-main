-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 04:26 PM
-- Server version: 10.11.16-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farm_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `pin` varchar(10) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `google_email` varchar(254) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `representative` varchar(255) DEFAULT NULL,
  `registration_certificate` varchar(255) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `phone`, `pin`, `name`, `google_id`, `google_email`, `created_at`, `updated_at`, `address`, `representative`, `registration_certificate`, `password`) VALUES
(1, '0999999999', '0000', 'Quản trị viên HTX', 'admin_google_123', 'admin@farm.com', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', NULL, NULL, NULL, NULL),
(8, NULL, '123321H', 'dfd', NULL, 'linh@gmail.com', '2026-03-30 12:48:33.702700', '2026-03-30 12:48:33.702726', '12rvfcf', 'aaaa', 'Screenshot 2026-03-23 093339.png', 'pbkdf2_sha256$1200000$TbvCrMu01CepLTClOQCMVv$sV5HahWk91wfFjQerobjEri+Dg35uFKmlyntJnBcfpI=');

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 3, 'add_permission'),
(6, 'Can change permission', 3, 'change_permission'),
(7, 'Can delete permission', 3, 'delete_permission'),
(8, 'Can view permission', 3, 'view_permission'),
(9, 'Can add group', 2, 'add_group'),
(10, 'Can change group', 2, 'change_group'),
(11, 'Can delete group', 2, 'delete_group'),
(12, 'Can view group', 2, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add admin', 7, 'add_admin'),
(26, 'Can change admin', 7, 'change_admin'),
(27, 'Can delete admin', 7, 'delete_admin'),
(28, 'Can view admin', 7, 'view_admin'),
(29, 'Can add farmer', 8, 'add_farmer'),
(30, 'Can change farmer', 8, 'change_farmer'),
(31, 'Can delete farmer', 8, 'delete_farmer'),
(32, 'Can view farmer', 8, 'view_farmer'),
(33, 'Can add lot', 11, 'add_lot'),
(34, 'Can change lot', 11, 'change_lot'),
(35, 'Can delete lot', 11, 'delete_lot'),
(36, 'Can view lot', 11, 'view_lot'),
(37, 'Can add material', 12, 'add_material'),
(38, 'Can change material', 12, 'change_material'),
(39, 'Can delete material', 12, 'delete_material'),
(40, 'Can view material', 12, 'view_material'),
(41, 'Can add planting zone', 13, 'add_plantingzone'),
(42, 'Can change planting zone', 13, 'change_plantingzone'),
(43, 'Can delete planting zone', 13, 'delete_plantingzone'),
(44, 'Can view planting zone', 13, 'view_plantingzone'),
(45, 'Can add stage', 14, 'add_stage'),
(46, 'Can change stage', 14, 'change_stage'),
(47, 'Can delete stage', 14, 'delete_stage'),
(48, 'Can view stage', 14, 'view_stage'),
(49, 'Can add task', 15, 'add_task'),
(50, 'Can change task', 15, 'change_task'),
(51, 'Can delete task', 15, 'delete_task'),
(52, 'Can view task', 15, 'view_task'),
(53, 'Can add task category', 16, 'add_taskcategory'),
(54, 'Can change task category', 16, 'change_taskcategory'),
(55, 'Can delete task category', 16, 'delete_taskcategory'),
(56, 'Can view task category', 16, 'view_taskcategory'),
(57, 'Can add incident report', 10, 'add_incidentreport'),
(58, 'Can change incident report', 10, 'change_incidentreport'),
(59, 'Can delete incident report', 10, 'delete_incidentreport'),
(60, 'Can view incident report', 10, 'view_incidentreport'),
(61, 'Can add farm log', 9, 'add_farmlog'),
(62, 'Can change farm log', 9, 'change_farmlog'),
(63, 'Can delete farm log', 9, 'delete_farmlog'),
(64, 'Can view farm log', 9, 'view_farmlog'),
(65, 'Can add sys admin', 17, 'add_sysadmin'),
(66, 'Can change sys admin', 17, 'change_sysadmin'),
(67, 'Can delete sys admin', 17, 'delete_sysadmin'),
(68, 'Can view sys admin', 17, 'view_sysadmin');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(7, 'api', 'admin'),
(8, 'api', 'farmer'),
(9, 'api', 'farmlog'),
(10, 'api', 'incidentreport'),
(11, 'api', 'lot'),
(12, 'api', 'material'),
(13, 'api', 'plantingzone'),
(14, 'api', 'stage'),
(17, 'api', 'sysadmin'),
(15, 'api', 'task'),
(16, 'api', 'taskcategory'),
(2, 'auth', 'group'),
(3, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-03-27 15:44:35.427423'),
(2, 'auth', '0001_initial', '2026-03-27 15:44:35.761575'),
(3, 'admin', '0001_initial', '2026-03-27 15:44:35.848179'),
(4, 'admin', '0002_logentry_remove_auto_add', '2026-03-27 15:44:35.856064'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2026-03-27 15:44:35.867082'),
(6, 'api', '0001_initial', '2026-03-27 15:44:36.112938'),
(7, 'contenttypes', '0002_remove_content_type_name', '2026-03-27 15:44:36.178093'),
(8, 'auth', '0002_alter_permission_name_max_length', '2026-03-27 15:44:36.213320'),
(9, 'auth', '0003_alter_user_email_max_length', '2026-03-27 15:44:36.229427'),
(10, 'auth', '0004_alter_user_username_opts', '2026-03-27 15:44:36.236756'),
(11, 'auth', '0005_alter_user_last_login_null', '2026-03-27 15:44:36.260058'),
(12, 'auth', '0006_require_contenttypes_0002', '2026-03-27 15:44:36.261726'),
(13, 'auth', '0007_alter_validators_add_error_messages', '2026-03-27 15:44:36.268367'),
(14, 'auth', '0008_alter_user_username_max_length', '2026-03-27 15:44:36.287789'),
(15, 'auth', '0009_alter_user_last_name_max_length', '2026-03-27 15:44:36.306574'),
(16, 'auth', '0010_alter_group_name_max_length', '2026-03-27 15:44:36.346229'),
(17, 'auth', '0011_update_proxy_permissions', '2026-03-27 15:44:36.357046'),
(18, 'auth', '0012_alter_user_first_name_max_length', '2026-03-27 15:44:36.371743'),
(19, 'sessions', '0001_initial', '2026-03-27 15:44:36.389875'),
(20, 'api', '0002_admin_extra_fields', '2026-03-28 04:05:17.126536'),
(21, 'api', '0003_sysadmin', '2026-03-30 09:27:51.540493'),
(22, 'api', '0004_admin_password', '2026-03-30 12:17:37.888231');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `farmers`
--

CREATE TABLE `farmers` (
  `id` bigint(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `pin` varchar(10) DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `birth_year` varchar(4) DEFAULT NULL,
  `managed_lot` varchar(100) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `google_email` varchar(254) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmers`
--

INSERT INTO `farmers` (`id`, `phone`, `pin`, `cccd`, `full_name`, `birth_year`, `managed_lot`, `google_id`, `google_email`, `created_at`, `updated_at`) VALUES
(1, '0987654321', '1234', '001090123456', 'Nguyễn Văn A', '1980', 'Lô 1', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(2, '0987654322', '5678', '001090654321', 'Trần Thị B', '1985', 'Lô 2', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(3, '0987654323', '9012', '001090789012', 'Lê Văn C', '1990', 'Lô 3', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(4, '0987654324', '3456', '001090345678', 'Phạm Thị D', '1975', 'Lô 1', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(7, '098765432', '123567', '086433', 'fed', '1388', 'Lô 2', NULL, NULL, '2026-03-30 10:18:21.428479', '2026-03-30 13:09:34.388669');

-- --------------------------------------------------------

--
-- Table structure for table `farm_logs`
--

CREATE TABLE `farm_logs` (
  `id` bigint(20) NOT NULL,
  `datetime` datetime(6) NOT NULL,
  `pest` varchar(100) DEFAULT NULL,
  `method` varchar(100) DEFAULT NULL,
  `fertilizer` varchar(100) DEFAULT NULL,
  `active_ingredient` varchar(100) DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `quarantine_time` varchar(50) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `waste_type` varchar(100) DEFAULT NULL,
  `material_name` varchar(100) DEFAULT NULL,
  `material_quantity` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `farmer_id` bigint(20) NOT NULL,
  `lot_id` bigint(20) DEFAULT NULL,
  `stage_id` bigint(20) DEFAULT NULL,
  `task_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farm_logs`
--

INSERT INTO `farm_logs` (`id`, `datetime`, `pest`, `method`, `fertilizer`, `active_ingredient`, `dosage`, `quarantine_time`, `images`, `waste_type`, `material_name`, `material_quantity`, `created_at`, `updated_at`, `farmer_id`, `lot_id`, `stage_id`, `task_id`) VALUES
(1, '2026-02-07 12:00:00.000000', 'Rêu', 'Champion', '', 'Copper Hydroxide', '2kg / 1000 lít nước', '7 Ngày', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1, 1, 1),
(2, '2026-02-07 14:00:00.000000', '', '', '', '', '', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 2, 3, 2),
(3, '2026-02-08 10:00:00.000000', '', '', 'Phân Lân Văn Điển', '', '2kg / 1 cây', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1, 2, 6),
(4, '2026-02-08 16:00:00.000000', '', '', '', '', '50lit/m2', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 2, 2, 1, 4),
(5, '2026-02-09 08:00:00.000000', '', '', 'Phân gà Nhật Bản', '', '', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 2, 3, 2, 5),
(6, '2026-02-09 12:00:00.000000', 'Sâu rầy', 'Najat 3.6', '', 'Abamectin', '800ml/800L', '7 Ngày', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 3, 3, 3, 8),
(7, '2026-02-10 09:00:00.000000', '', '', '', '', '', '', '[]', 'Thu gom chất thải độc hại', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 4, 1, 4, 9),
(8, '2026-02-10 15:00:00.000000', '', '', '', '', '', '', '[]', '', 'Champion', '10kg', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `incident_reports`
--

CREATE TABLE `incident_reports` (
  `id` bigint(20) NOT NULL,
  `datetime` datetime(6) NOT NULL,
  `report_type` varchar(100) DEFAULT NULL,
  `description` longtext NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `farmer_id` bigint(20) NOT NULL,
  `lot_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incident_reports`
--

INSERT INTO `incident_reports` (`id`, `datetime`, `report_type`, `description`, `images`, `created_at`, `updated_at`, `farmer_id`, `lot_id`) VALUES
(1, '2026-03-20 08:30:00.000000', 'Sâu bệnh', 'Phát hiện rệp sáp trên lá non, mật độ cao', '[]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1),
(2, '2026-03-21 10:15:00.000000', 'Thời tiết', 'Mưa lớn gây ngập úng một phần vườn', '[]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 2, 2),
(3, '2026-03-22 14:45:00.000000', 'Thiết bị', 'Hệ thống tưới bị hỏng ở khu vực Đông', '[]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 3, 3),
(4, '2026-03-23 11:20:00.000000', 'Khác', 'Phát hiện cỏ dại kháng thuốc', '[]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `lots`
--

CREATE TABLE `lots` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lots`
--

INSERT INTO `lots` (`id`, `name`, `created_at`) VALUES
(1, 'Lô 1', '2026-03-27 22:46:19.000000'),
(2, 'Lô 2', '2026-03-27 22:46:19.000000'),
(3, 'Lô 3', '2026-03-27 22:46:19.000000');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `active_ingredient` varchar(100) DEFAULT NULL,
  `is_vietgap` tinyint(1) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `min_stock` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `name`, `type`, `active_ingredient`, `is_vietgap`, `unit`, `quantity`, `min_stock`, `created_at`, `updated_at`) VALUES
(1, 'Champion', 'Thuốc BVTV', 'Copper Hydroxide', 1, 'kg', 50.00, 5.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(2, 'Najat 3.6', 'Thuốc BVTV', 'Abamectin', 1, 'lít', 20.00, 2.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(3, 'Phân gà Nhật Bản', 'Phân bón', NULL, 1, 'kg', 100.00, 10.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(4, 'Phân Lân Văn Điển', 'Phân bón', NULL, 1, 'kg', 200.00, 20.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(5, 'NPK 30-10-10', 'Phân bón', NULL, 1, 'kg', 150.00, 15.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(6, 'Tado 4.0', 'Thuốc BVTV', 'Picoxystrobin', 1, 'lít', 30.00, 3.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(7, 'Bình Dân', 'Thuốc BVTV', 'Abamectin', 1, 'kg', 25.00, 2.50, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(8, 'Dipimai 150 EC', 'Thuốc BVTV', 'Pyridaben', 1, 'lít', 15.00, 1.50, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(9, 'Humic', 'Phân bón', 'Axit Humic', 1, 'kg', 40.00, 4.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000');

-- --------------------------------------------------------

--
-- Table structure for table `planting_zones`
--

CREATE TABLE `planting_zones` (
  `id` bigint(20) NOT NULL,
  `crop_type` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`lots`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `planting_zones`
--

INSERT INTO `planting_zones` (`id`, `crop_type`, `name`, `lots`, `created_at`, `updated_at`) VALUES
(1, 'Sầu riêng', 'Khu vực Sầu riêng 1', '[\"Lô 1\", \"Lô 2\"]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000'),
(2, 'Bưởi', 'Khu vực Bưởi 1', '[\"Lô 3\"]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000');

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

CREATE TABLE `stages` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `name`, `created_at`) VALUES
(1, 'Trước Gieo Trồng', '2026-03-27 22:46:19.000000'),
(2, 'Phân hoá mầm hoa', '2026-03-27 22:46:19.000000'),
(3, 'Trước Thu Hoạch', '2026-03-27 22:46:19.000000'),
(4, 'Khác', '2026-03-27 22:46:19.000000');

-- --------------------------------------------------------

--
-- Table structure for table `sysadmins`
--

CREATE TABLE `sysadmins` (
  `id` bigint(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(128) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sysadmins`
--

INSERT INTO `sysadmins` (`id`, `email`, `password`, `name`, `created_at`, `updated_at`) VALUES
(1, 'sysadmin@openfarm.vn', 'pbkdf2_sha256$1200000$og87S3Vqi5kITb0Vy91vOh$dwZ0dXrsbb0u7X+6Y+vxebpvqpp/nlDxjswvxOQEK3I=', 'SysAdmin OpenFarm', '2026-03-30 09:36:25.958881', '2026-03-30 09:36:25.958919');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `requires_materials` tinyint(1) NOT NULL,
  `default_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`default_values`)),
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `icon`, `color`, `requires_materials`, `default_values`, `created_at`) VALUES
(1, 'Rửa vườn', 'Droplets', 'bg-blue-100 text-blue-600', 1, '{\"task\": \"Rửa vườn\", \"pest\": \"Rêu\", \"method\": \"Champion\", \"active_ingredient\": \"Copper Hydroxide\", \"dosage\": \"2kg / 1000 lít nước\", \"quarantine_time\": \"7 Ngày\"}', '2026-03-27 22:46:19.000000'),
(2, 'Cắt tỉa cành', 'Scissors', 'bg-gray-100 text-gray-600', 0, '{\"task\": \"Cắt tỉa cành\"}', '2026-03-27 22:46:19.000000'),
(3, 'Làm sạch cỏ', 'Leaf', 'bg-green-100 text-green-600', 0, '{\"task\": \"Làm sạch cỏ\"}', '2026-03-27 22:46:19.000000'),
(4, 'Tưới nước', 'CloudRain', 'bg-cyan-100 text-cyan-600', 0, '{\"task\": \"Tưới nước\", \"dosage\": \"50lit/m2\"}', '2026-03-27 22:46:19.000000'),
(5, 'Bón phân vi sinh', 'Sprout', 'bg-lime-100 text-lime-600', 1, '{\"task\": \"Bón phân vi sinh\", \"fertilizer\": \"Phân gà Nhật Bản\"}', '2026-03-27 22:46:19.000000'),
(6, 'Bón phân Lân', 'FlaskConical', 'bg-orange-100 text-orange-600', 1, '{\"task\": \"Bón phân\", \"fertilizer\": \"Phân Lân Văn Điển\", \"dosage\": \"2kg / 1 cây\"}', '2026-03-27 22:46:19.000000'),
(7, 'Bón phân NPK', 'FlaskConical', 'bg-amber-100 text-amber-600', 1, '{\"task\": \"Bón phân\", \"fertilizer\": \"NPK 30-10-10\", \"dosage\": \"1kg / cây\"}', '2026-03-27 22:46:19.000000'),
(8, 'Phun thuốc Sâu Rầy', 'BugOff', 'bg-red-100 text-red-600', 1, '{\"task\": \"Phun thuốc Sâu Rầy\", \"pest\": \"Sâu rầy\", \"method\": \"Najat 3.6\", \"active_ingredient\": \"Abamectin\", \"dosage\": \"800ml/800L\", \"quarantine_time\": \"7 Ngày\"}', '2026-03-27 22:46:19.000000'),
(9, 'Xử lý chất thải', 'Trash2', 'bg-stone-100 text-stone-600', 0, '{\"task\": \"Xử lý chất thải\", \"waste_type\": \"Thu gom chất thải độc hại\"}', '2026-03-27 22:46:19.000000'),
(10, 'Quản lý vật tư', 'Package', 'bg-indigo-100 text-indigo-600', 0, '{\"task\": \"Quản lý vật tư\"}', '2026-03-27 22:46:19.000000'),
(11, 'Vệ sinh kho', 'Warehouse', 'bg-teal-100 text-teal-600', 0, '{\"task\": \"An toàn vệ sinh kho\"}', '2026-03-27 22:46:19.000000'),
(12, 'An toàn lao động', 'HardHat', 'bg-yellow-100 text-yellow-600', 0, '{\"task\": \"An toàn lao động\"}', '2026-03-27 22:46:19.000000'),
(14, 'fff', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"fff\", \"pest\": \"rr\", \"method\": \"frdfr\", \"fertilizer\": \"fff\", \"activeIngredient\": \"vff\", \"dosage\": \"45\", \"quarantineTime\": \"6\"}', '2026-03-30 13:36:09.676396');

-- --------------------------------------------------------

--
-- Table structure for table `task_categories`
--

CREATE TABLE `task_categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `task_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`task_ids`)),
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_categories`
--

INSERT INTO `task_categories` (`id`, `name`, `task_ids`, `created_at`) VALUES
(1, 'Chăm sóc', '[\"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"14\"]', '2026-03-27 22:46:19.000000'),
(2, 'Phòng trừ sâu bệnh', '[8]', '2026-03-27 22:46:19.000000'),
(3, 'Thu hoạch', '[\"13\"]', '2026-03-27 22:46:19.000000'),
(4, 'Vệ sinh', '[9,10,11,12]', '2026-03-27 22:46:19.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD UNIQUE KEY `google_email` (`google_email`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `farmers`
--
ALTER TABLE `farmers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `cccd` (`cccd`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD UNIQUE KEY `google_email` (`google_email`);

--
-- Indexes for table `farm_logs`
--
ALTER TABLE `farm_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farm_logs_farmer_id_e316a5be_fk_farmers_id` (`farmer_id`),
  ADD KEY `farm_logs_lot_id_b37d1e85_fk_lots_id` (`lot_id`),
  ADD KEY `farm_logs_stage_id_0498d5ed_fk_stages_id` (`stage_id`),
  ADD KEY `farm_logs_task_id_8f017b5b_fk_tasks_id` (`task_id`);

--
-- Indexes for table `incident_reports`
--
ALTER TABLE `incident_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incident_reports_farmer_id_beb22139_fk_farmers_id` (`farmer_id`),
  ADD KEY `incident_reports_lot_id_f93c20b4_fk_lots_id` (`lot_id`);

--
-- Indexes for table `lots`
--
ALTER TABLE `lots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `planting_zones`
--
ALTER TABLE `planting_zones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sysadmins`
--
ALTER TABLE `sysadmins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `task_categories`
--
ALTER TABLE `task_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `farmers`
--
ALTER TABLE `farmers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `farm_logs`
--
ALTER TABLE `farm_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `incident_reports`
--
ALTER TABLE `incident_reports`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lots`
--
ALTER TABLE `lots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `planting_zones`
--
ALTER TABLE `planting_zones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sysadmins`
--
ALTER TABLE `sysadmins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `task_categories`
--
ALTER TABLE `task_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `farm_logs`
--
ALTER TABLE `farm_logs`
  ADD CONSTRAINT `farm_logs_farmer_id_e316a5be_fk_farmers_id` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`),
  ADD CONSTRAINT `farm_logs_lot_id_b37d1e85_fk_lots_id` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`),
  ADD CONSTRAINT `farm_logs_stage_id_0498d5ed_fk_stages_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`),
  ADD CONSTRAINT `farm_logs_task_id_8f017b5b_fk_tasks_id` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`);

--
-- Constraints for table `incident_reports`
--
ALTER TABLE `incident_reports`
  ADD CONSTRAINT `incident_reports_farmer_id_beb22139_fk_farmers_id` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`),
  ADD CONSTRAINT `incident_reports_lot_id_f93c20b4_fk_lots_id` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
