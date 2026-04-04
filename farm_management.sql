-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2026 at 08:33 AM
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
  `password` varchar(128) DEFAULT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `phone`, `pin`, `name`, `google_id`, `google_email`, `created_at`, `updated_at`, `address`, `representative`, `registration_certificate`, `password`, `status`) VALUES
(1, '0999999999', '0000', 'Quản trị viên HTX', 'admin_google_123', 'admin@farm.com', '2026-03-27 22:46:19.000000', '2026-04-04 04:38:54.045133', NULL, NULL, NULL, NULL, 'approved'),
(8, NULL, '123321H', 'dfd', NULL, 'linh@gmail.com', '2026-03-30 12:48:33.702700', '2026-04-04 04:38:56.772344', '12rvfcf', 'aaaa', 'Screenshot 2026-03-23 093339.png', 'pbkdf2_sha256$1200000$TbvCrMu01CepLTClOQCMVv$sV5HahWk91wfFjQerobjEri+Dg35uFKmlyntJnBcfpI=', 'approved'),
(9, NULL, '123321H', 'HTX mmmmm', NULL, 'phamhoangminh220399@gmail.com', '2026-04-03 09:05:28.939387', '2026-04-04 04:38:36.964184', 'f', 'zssvdsd', 'R.png', 'pbkdf2_sha256$1200000$3g3nfAnbbRkYX0j7DhwiY0$cYQ5oEwf1aH3UR/h2QuXYYcBq0UwRxHlpOvu/ihCICk=', 'approved'),
(10, '0987654321', NULL, 'HTX Nông nghiệp Xanh', NULL, NULL, '2026-04-04 01:20:29.451370', '2026-04-04 03:40:46.647381', 'Xã Liêm Tuyền, Huyện Thanh Trì, Hà Nội', 'Nguyễn Văn An', 'HTX-4321', NULL, 'approved'),
(11, '0988888888', NULL, 'HTX Rau sạch Việt Nam', NULL, NULL, '2026-04-04 01:20:29.518651', '2026-04-04 04:41:13.952979', 'Xã Mỹ Hưng, Huyện Thanh Trì, Hà Nội', 'Lê Thị E', 'HTX-8888', NULL, 'approved'),
(12, '0977777777', NULL, 'HTX Lúa hữu cơ Bắc Bộ', NULL, NULL, '2026-04-04 01:20:29.555296', '2026-04-04 04:41:15.871856', 'Xã Tả Thanh Oai, Huyện Thanh Trì, Hà Nội', 'Phan Văn H', 'HTX-7777', NULL, 'approved'),
(13, NULL, '123321H', 'd', NULL, 'linhhhhhhhhhhhhh@gmail.com', '2026-04-04 02:22:38.972276', '2026-04-04 03:40:51.974847', 'dddddddd', 'ddddddd', 'R.png', 'pbkdf2_sha256$1200000$oD5w6PRqvTL6bAClRpVBWW$4KcpoGhOY4yxx4lgPKD8/nLF5jWRap6RZ6joy4A+GU0=', 'approved');

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
(68, 'Can view sys admin', 17, 'view_sysadmin'),
(69, 'Can add viet gap registration', 18, 'add_vietgapregistration'),
(70, 'Can change viet gap registration', 18, 'change_vietgapregistration'),
(71, 'Can delete viet gap registration', 18, 'delete_vietgapregistration'),
(72, 'Can view viet gap registration', 18, 'view_vietgapregistration'),
(73, 'Can add farm', 19, 'add_farm'),
(74, 'Can change farm', 19, 'change_farm'),
(75, 'Can delete farm', 19, 'delete_farm'),
(76, 'Can view farm', 19, 'view_farm');

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
(19, 'api', 'farm'),
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
(18, 'api', 'vietgapregistration'),
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
(22, 'api', '0004_admin_password', '2026-03-30 12:17:37.888231'),
(23, 'api', '0005_vietgapregistration', '2026-04-01 11:52:29.700890'),
(24, 'api', '0006_plantingzone_certificate_files', '2026-04-01 11:52:29.736133'),
(25, 'api', '0007_farm', '2026-04-03 05:24:19.319755'),
(26, 'api', '0008_sample_farm_data', '2026-04-03 05:35:27.420905'),
(27, 'api', '0009_add_admin_to_farmer', '2026-04-03 06:09:58.087593'),
(28, 'api', '0007_material_status', '2026-04-03 10:55:52.157913'),
(29, 'api', '0010_merge_0007_material_status_0009_add_admin_to_farmer', '2026-04-03 10:55:52.159660'),
(30, 'api', '0011_vietgapregistration_fields', '2026-04-03 11:39:30.154678'),
(31, 'api', '0011_admin_status', '2026-04-04 01:39:20.004435'),
(32, 'api', '0012_plantingzone_admin_task_admin_taskcategory_admin_and_more', '2026-04-04 02:55:27.920525'),
(33, 'api', '0013_cleanup_orphaned_tasks_and_require_admin', '2026-04-04 04:34:01.108735'),
(34, 'api', '0014_fix_task_category_unique_constraint', '2026-04-04 04:50:28.465165'),
(35, 'api', '0015_add_default_task_categories', '2026-04-04 04:50:28.503994'),
(36, 'api', '0016_remove_admin_from_task_categories', '2026-04-04 04:57:39.548990'),
(37, 'api', '0017_fix_task_unique_constraint', '2026-04-04 05:04:58.339955'),
(38, 'api', '0018_add_default_tasks_to_categories', '2026-04-04 05:04:58.493728');

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
  `updated_at` datetime(6) NOT NULL,
  `admin_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmers`
--

INSERT INTO `farmers` (`id`, `phone`, `pin`, `cccd`, `full_name`, `birth_year`, `managed_lot`, `google_id`, `google_email`, `created_at`, `updated_at`, `admin_id`) VALUES
(1, '0987654321', '1234', '001090123456', 'Nguyễn Văn A', '1980', 'Lô 1', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1),
(2, '0987654322', '1234', '001090654321', 'Trần Thị B', '1985', 'Lô 3', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-04-04 01:04:02.671559', 8),
(3, '0987654323', '9012', '001090789012', 'Lê Văn C', '1990', 'Lô 3', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1),
(4, '0987654324', '3456', '001090345678', 'Phạm Thị D', '1975', 'Lô 1', NULL, NULL, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1),
(7, '098765432', '4441', '086433', 'hehee', '1388', 'Lô 2', NULL, NULL, '2026-03-30 10:18:21.428479', '2026-04-03 15:04:58.090660', 1),
(9, '0123456789', '2344', '123456789', 'Test Farmer', '1995', 'Lô 1', NULL, NULL, '2026-04-03 06:25:04.651210', '2026-04-03 15:04:44.253830', 1),
(10, '0912345678', NULL, '123456789012', 'Trần Văn B', '1980', 'Lô B', NULL, NULL, '2026-04-04 01:20:29.469871', '2026-04-04 01:20:29.469911', 10),
(11, '0923456789', NULL, '234567890123', 'Phạm Thị C', '1985', 'Lô C', NULL, NULL, '2026-04-04 01:20:29.476180', '2026-04-04 01:20:29.476215', 10),
(12, '0934567890', NULL, '345678901234', 'Đặng Văn D', '1990', 'Lô D', NULL, NULL, '2026-04-04 01:20:29.482332', '2026-04-04 01:20:29.482373', 10),
(13, '0945678901', NULL, '456789012345', 'Hoàng Văn F', '1988', 'Lô F', NULL, NULL, '2026-04-04 01:20:29.525609', '2026-04-04 01:20:29.525643', 11),
(14, '0956789012', NULL, '567890123456', 'Vũ Thị G', '1992', 'Lô G', NULL, NULL, '2026-04-04 01:20:29.531461', '2026-04-04 01:20:29.531504', 11),
(15, '0967890123', NULL, '678901234567', 'Tô Văn I', '1987', 'Lô I', NULL, NULL, '2026-04-04 01:20:29.562801', '2026-04-04 01:20:29.562850', 12),
(16, '0978901234', NULL, '789012345678', 'Bùi Thị J', '1993', 'Lô J', NULL, NULL, '2026-04-04 01:20:29.568315', '2026-04-04 01:20:29.568344', 12),
(17, '0989012345', NULL, '890123456789', 'Chu Văn K', '1995', 'Lô K', NULL, NULL, '2026-04-04 01:20:29.574822', '2026-04-04 01:20:29.574854', 12),
(18, '0073685142', '1234', '075433444', 'hệ', '1999', 'Lô 1', NULL, NULL, '2026-04-04 05:56:04.942272', '2026-04-04 05:56:04.942300', 13);

-- --------------------------------------------------------

--
-- Table structure for table `farms`
--

CREATE TABLE `farms` (
  `id` bigint(20) NOT NULL,
  `cooperative_name` varchar(255) NOT NULL,
  `address` longtext NOT NULL,
  `total_area` decimal(10,2) NOT NULL,
  `main_crop_type` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `admin_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farms`
--

INSERT INTO `farms` (`id`, `cooperative_name`, `address`, `total_area`, `main_crop_type`, `created_at`, `updated_at`, `admin_id`) VALUES
(1, 'HTX Nông nghiệp Xanh', 'Thôn Đông Anh, Xã Liêm Tuyền, Huyện Thanh Trì, Thành phố Hà Nội', 45.50, 'Rau', '2026-04-03 05:35:27.413561', '2026-04-03 05:35:27.413586', 8),
(2, 'HTX Rau sạch Việt Nam', 'Thôn Phú Mỹ, Xã Mỹ Hưng, Huyện Thanh Trì, Thành phố Hà Nội', 32.80, 'Rau', '2026-04-03 05:35:27.417681', '2026-04-03 05:35:27.417703', 1),
(3, 'HTX Nông nghiệp Xanh', 'ddd', 33.00, 'Ngô', '2026-04-03 12:36:56.676661', '2026-04-03 12:36:56.676682', 9),
(4, 'HTX ........222.....', 'fffd', 35.00, 'Cà phê', '2026-04-04 06:01:21.686862', '2026-04-04 06:01:21.686886', 13);

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
(2, '2026-02-07 14:00:00.000000', '', '', '', '', '', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 2, 3, NULL),
(3, '2026-02-08 10:00:00.000000', '', '', 'Phân Lân Văn Điển', '', '2kg / 1 cây', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1, 2, NULL),
(4, '2026-02-08 16:00:00.000000', '', '', '', '', '50lit/m2', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 2, 2, 1, NULL),
(5, '2026-02-09 08:00:00.000000', '', '', 'Phân gà Nhật Bản', '', '', '', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 2, 3, 2, NULL),
(6, '2026-02-09 12:00:00.000000', 'Sâu rầy', 'Najat 3.6', '', 'Abamectin', '800ml/800L', '7 Ngày', '[]', '', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 3, 3, 3, NULL),
(7, '2026-02-10 09:00:00.000000', '', '', '', '', '', '', '[]', 'Thu gom chất thải độc hại', '', '', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 4, 1, 4, NULL),
(8, '2026-02-10 15:00:00.000000', '', '', '', '', '', '', '[]', '', 'Champion', '10kg', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1, 1, NULL),
(10, '2026-03-30 08:37:00.000000', 'Rêu', 'Champion', 'dd', '', '2kg / 1000 lít nước', '', '[]', NULL, NULL, NULL, '2026-03-30 15:37:07.953505', '2026-03-30 15:37:07.953519', 4, 1, 1, 1),
(11, '2026-04-03 02:22:00.000000', 'g', 'ddd', 'Phân Lân Văn Điển', 'ddd', '2kg / 1000 lít nước', '443', '[]', NULL, NULL, NULL, '2026-04-03 09:22:41.954910', '2026-04-03 09:22:41.954925', 2, 3, 3, 1),
(12, '2026-04-03 02:23:00.000000', 'Rêu', 'Champion', '', '', '2kg / 1000 lít nước', '', '[]', NULL, NULL, NULL, '2026-04-03 09:23:18.389127', '2026-04-03 09:23:18.389136', 2, 1, 4, NULL),
(13, '2026-04-03 02:35:00.000000', 'g', 'ddd', 'Phân ddddddddddd', 'ddd', '2kg / 1000 lít nước', '443', '[\"Screenshot 2026-03-23 090157.png\"]', NULL, NULL, NULL, '2026-04-03 09:36:26.997564', '2026-04-03 09:36:26.997577', 4, 1, 4, NULL);
INSERT INTO `farm_logs` (`id`, `datetime`, `pest`, `method`, `fertilizer`, `active_ingredient`, `dosage`, `quarantine_time`, `images`, `waste_type`, `material_name`, `material_quantity`, `created_at`, `updated_at`, `farmer_id`, `lot_id`, `stage_id`, `task_id`) VALUES
(14, '2026-04-03 22:35:00.000000', 'ddddd', '', '', '', '', '', '[\"data:image/jpeg;base64,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\"]', NULL, NULL, NULL, '2026-04-04 05:35:13.003776', '2026-04-04 05:35:13.003789', 13, 1, 4, NULL);
INSERT INTO `farm_logs` (`id`, `datetime`, `pest`, `method`, `fertilizer`, `active_ingredient`, `dosage`, `quarantine_time`, `images`, `waste_type`, `material_name`, `material_quantity`, `created_at`, `updated_at`, `farmer_id`, `lot_id`, `stage_id`, `task_id`) VALUES
(16, '2026-04-03 22:40:00.000000', 'ddddd', 'sss', 'ddd', 'ddd', '', '', '[\"data:image/png;base64,UklGRlwWAABXRUJQVlA4IFAWAAAQZACdASq4ASwBPp1OoUylpCMiI3ZI6LATiWlu/HyZNMutf0Dwgdf6v2d/3PxT8Q/nP9c/cH17sw/WJqd/HPs3+n/tfuO/Ze8H4Y6gX4v/M/7/9tvCbAA/Lv6x/zf7V62P2XmH9nPYA8fP+74Bv2v/oewB/Rv7x6A3/n/nvOJ9OftV8A/87/un/Y9cz//+4D9v///7s/7k//8VZaNxth7ZgDxn7f6CntmAPGft/oKe2YA8Z+3+gp7ZgDxn7f6CbijmTjbOqTGjcbYelijjWR3emV/3cUK43nqQBrS729FiRRtnVJjRuNsPamXZi0N9tPCcrv616b9SP//+IcUdqj+XgrchqHWzAHjP2/0FPSkYRjJmuwYq465Zuzl8vuANr/1rs8tU/JmzOTLa5qPr604dG42w9swB4z7R/VBNjZEiDQYmy9Kn/rAEaSrbxHgs4SpjCZvlRa2a1c+/qzni6DkjLVyvoVsZ1IhYtG/t/oKe2YA8W1dLRO76ciuw1+zTtMfAgwRJIkb7zdjLHvKXA4oPvCJeC1PPnep2kl4g88IhDu0vhv0xMPJOYgp7ZgDxn27yw4Xae/SMfyTt+dudFOmCx9j4vUAQ3FYHqYL8O0Lu6f7+a80/jiPhgX9gd3o8NeToqlvD50bZ1SY0bfyMTbqRD/83yEiEqTFMtWNDc72di2i0x734VCibUkP/D+ir1mUShg4CN/iP8P1P3zzSkBJb/QU9swBlgwFqddCda/GP+j1y1VRwLCsEniYnuktyNowxzK/d6KqJWi//NhQJu9Gl+Qs+1CcZRgDxn7f6ABxuNSy0qkDO89G/3Dq0XCaJ7EiUmMSimdZ2u6UyNq/za/c7F9XNTVFT2zAHjP2/lQuk4FHfYdck3jndz3Q/2Mt4aXZ+iZg0h36EuYfvx3rnnRuNsPbMAeLKzdQucKfIxs/msFvXzWo+8B/6sqlqxrkrkrUhOPZmJMaNxth7ZgDMsyIHi1rytqN8oL4tJrwLf6CntmAPGft/oKe2YA8Z+3+gp7ZgDxn7f6CntmAPGft/oKe2YA8Z+3+gp7ZgDxn7f6CntmAPGft/oKe04AD++CCAAAwjZ+1Ms5Nni3frnYHIL3aI05LiPy8NMlWTsEogKy9i2tN1P0m4AYyH2ZhUNFqGINH1EQDupfCmaLY39NFuzRI4UZXPBvLbWtVF38DpWQoHpjC9pbQ7aMWB+R7oLQKmiFrUQ/EL8gdLZdV5OhHLy3xw3xT4bZDSrnXYmD+HERnfXtuFvJ5D10t2QywVZz8jQ8zQtnWYz9mbOo7ellkGbt+cf9JTxLFXqd1Cnw6j19zEwNeNAMkvotfOKM7B9QUl0pxL4VRL9BwsuFhHRMFGoU0JQyHxStWF8ULiWMmAcBp/lfAVDQB9s9Ea6KPK1GemK0CTKxN8DPcaJ/6Xg7zNGGOh0DTK5AigjfC504EXF2Zg3JruE1cB7YC/cpYpEAitkCa4sKFcBTNpTfmt/eklrSy/kCnyOHnil8RLL7BxDxR0bsODt0JbqKn9IXb6fN6S8Y83+k8GRsAPCIzaEzvuViW03l4TxRiTXdlOFasYtQ48pGSSvh8Hd98xi/1lbDniL8D8oIUBmGEA1GwlKo2wGdEqHRLcgqt3EFrsxsWmd+sFiiiqKi5imMj8mMZRr6qY9bHZSn4yAQt2wypGg6kqR6nizJ3nJegCB7VP9K8A6KpboteBsLtXISFjlmY2OPWxJsywaZlWNuWJFbfoAHT7QCZGOl0ED9WQQKZJErpc41pHbJsi8OnU0LZY4kxXnvTQLOKzssiwSA51qVOcGn2k4o7EH1aezzOPXSmS5yE4ikfDiNpQiro2FsWt//b/IipEr4iLpuJxxhl5Zo5ZAFXISuoMFiFjQA5c/nOFmq56l7c4qMZ0/UUjuzxICyxKoxjQ0qEKnnZWfPqL2P3gsn8beb8FNN/aoLSZS2K7CIC7g2fiOONqN/y+WXzpOHIbjatLeIuOYyZ5/OxxlhHt5MpddiGyVii/ttqkBkqzN8NTlgAu4HqVRgcKgEvJIlrNIjQnc6v99UENf1FMRxR9Q612wdvSPiFb3hHJGlaDfIQMTQQICg8vepD+RFu/LDqQYKc5vY4kQxi4SeBhjF03H9HTxJMians8XY563VRbNy/W5m1oIeis6uLOMAtWCR0HvJOk/oD8OeWjwEbAaWvHXnyRyuBEALX8UqrrG8xGW7jupCo2rR2AdmnCi4usyxgRUsHCNyNv9tMbAbDnrDI0/vCiVqY73jhjOc4NCDMKtn6DZTwWbyI7NngFGX6K+cSX4UHFJ6b8ICbqEZkmsZ8PyZRTM4Sx3VBnOWbbJU+CStvXF2ZvcQYWvo27kgfXc/j3b6XdZItFI+76oI+mBmXbjpkeHM76tp0S776kn0STMyB4pcG3rywMzDR6P8xZ3WmsB79OCsW2Us/oXDMi4I0Lht0I65XO1HPjO7Bq/EH1aYIsB+aVMRDcB5+miM/aLZ4LURieJoAtPHuqZNCjvcaZKiC/VtQjt61x/iDrNvieQmpyBtepNykBZ89Xplj+IM5bHy/OTF4daolBzFPbibJnU07NmnF8tKcfai86DYzUexvREeBhyoq6tpMsTAEmPxRgDWTgyaklV39wiAdXBOsDEkgMxic+CGhxfeLAA3n379zTLkUNgXrwQNd8wln89nWReFV1uogiMUKoyy8rPMpIWZ8DzgyU7jvyIFPLVaz9iODWUVyxnv2bv/znqvVIDMG5vehmpzjhjAKx8l+ATaSZSeA2flBBFufGrJ5dgu5t5fyBI6LIo42tv3WknbnLyBS0x7xCclTAeIQRVvpcRaYXEtsyvCkwmLBFzKtQkh8K3LjaX2SMUPpqdq+M2radmUZ8DEfk/etRjqCTMaGT+jWCBykoCfDqyV6gI8bLL6tbLuTx23p3WZHmSkTnV2zTd+p0my2TUgZNjlle9AgPNG6r6IGX/WEeVb22xhpn5EqbmYKJVJIgBJp75o6XpzFE21isp3EDjpq2fIZv/4XcDSkCZgSzkBnie5cnRMhBAPWLcjhTIOPSMfDyvVLktbIqAfne+6fYePQ0200eb3uxL3uPhNLU0Ty0Hub1VNRJjqgplpy5vA6RSdwsue0s5QcKw5pHYlm6L/GVp1j3tnNU13bCHxns6hmSfjTPwardNWHdZ2RE5Lm1ExgTVkzwanH4L/c5YLHw5t09FUbLQvoiba3lGoJ7clTK3p0ahIj4IIG84wt+gbEIbBpyeg55zPpNiiyR7DblQL3MGK2ORYm6fdqmAhGpo98ZowF4UO16eeDbpCQ4+u9VJeJzkBI8WW+xNVCpcyfnjReg8XGNDdJ4cKKCOOdtffWKMdu/pHLjthdqAwYRp7w7s6NFG9o67a/cbyWW/c/BWYJLYcZbV7JPyopOgr4or+/Wocf1gxLHgtji5Ac0eyONJkWizqnh7h8+z7wVqauIm5RpPCNJ8UuM3IjGpFsZoS4rskUHafUKxmHgSDF1ZoPqPL4QJsQatNRQ6xks6l9X8ZIcbU8TNhOtWOhgbqQkZKJlfdhOjcxmUYZlHvux1w1De2DNrZN8lJSBVdBXHihdzGvJ5qtfu2pA6c+dne1Sy/Va12FsgBmEyMrs/SQoda4Zl9vInlh9XOmntH3mCSGh67VQN7Cfp75TBLN2ggo5VEtqcdykj2KHstJc53Jw270BBz/adsP9kQEk9kHBFj9T6KkJ0y+79gAjdflSxKfUtXcrl0qHpJMuwe6viFx330NhuQ1QUIwQMJAKB0IKWNIOpNXxHlItT4M4WVg+qeHvwTZ/j97JyMIrDkaZtOf5jw0BVBxJA/eSONW0aKZPAW5fhhjEfmGg6nXgnhRA8pFcp5uSAw34kgNptG0UP6XfbZE1fsI+5O/SYCdoDnk8q7PjPWaHuwGYdBbaVN7X4vVdAbL3xPBrZo7Xc1AlTEoGGOyqXOG5dFSFUXRt2Hm6+s39djfnwuF/h1uhzuGv1pHugUeXuVBdjcvp4q5BQtZRKMeDa30p+S6nnMeN4cjA3/C0IARERSwNh+GzRQ7ztXtUF1vTmlVmxGtsznXRuHEUc8xAVV2XHuAtOZosKPCkOoh/lXWNlpeVgw4BwAVaZMsaTxPl7MvJtlca72V472HQeHcBiBrfTJh+Q6fuibltGFEveO4njLHZd02d1b19j13vLX9LJKr62h2+Vb8D6lP2It7akILhekQEyMIbOql2Oh03qNOf/kz1DiqJPk68aKPpJp+RD9H3Eu+yQbSg0CJECsRWy3JfLDY/mn5NEQ02viS+wVdBwfnzEQgCuY83IrgCMECi58rfCMnB5xHyR5VoW7jIQpufj9W96YAKJBse5nGrVeImBc45pYP6Yj5L3S32Vp6yco5PnWJ2aoNn8yAPAlNgCwZikQCFd5tXLW1iVYKDOjN56XTG1P4zcy0pQK88NhovUebXU0tCaXxgpKbp3W4JmoGP5UzzUMTT6qAawX8shuDkkV/m5nfB2MjHEb7XkEKs6pmej+5nssYZfeogZPkk8ACViQEVvseBXYmcHOvxsFfLJTGsZdGGi4TcYyVTu4Zerg8GGh2pI6a+lad//Z4usgM9B7q3S3P7j2ViuUWYQVftjbvCy/3/X9pUXdUCLWcV5HjAIe2uNFq5dtExnZn220BevDOpvwudsb0GRaOSud7TOjYwVFjv3n+2WX/WDwsblHzipC5FLmCHCcex7u6ZrC1jXMAEDTsaIeH6pfs2jI/q38IvPLpowJTo9WZLCC36L6KFGrun2B4qDC2jhCjQXPvjCCqmvEl8AzMsQNs2IwcaTazg3k9O1IBln9X+naE6KiCb4K6A+v6QnpelMSmea3xPhyqdoRDMAg4KzQ2DYt9CouReeOemH3mV0iTuRO8Rn37h52tOIufcZ7oqLtkGIyCSzeI4hYQmZAp2G5bPbCrZKJBL4fZ4Apb0Bgh/Lt2GMziAL2Qldw5kPzeg+qnMap/GfLAHZIE5LFUQu9E4fWdXFhRuCd/jb0OLq1MUJ4tXthfvUFiSgvJyuk6aByFE3lvGyeqh3ISZBb3fKtA98TkggELEGo9HVzUrFaGAEcN43jvceHQ/xgluKgfX4sv6TiwnAMJUl94sQjTznfyxKkO5BQSiqHfKVKVgkD87K+mwi2BJ7k+HIXGdsuUWRdUfPoXM0+A76f5UqAOS9+eUHlzOtsK6bnrcwzA3qwQBAFbCc8kYVdGoDaM0FjUmKtQwZxw35WdRv3Iw81DZvf34J4g6P9LeWjdmoLAEyRAhcx884oLj9nm2gSMYaXgeKbobBol6Up2cJ0bMBDCkpE/8cuNPb9bSfWe1TxfGCwnoPSAvI/iOFcTI7WtvxhnHxygyY+RVsOkydSyf5XnPP2CKc3/S/tZ5XXTCA1stbAA8P6dn0xmsGRS6Tt+IPzOLlcaxnPKDSIVsnXycLSFqU8qWmWiXIaXnNdIg4ci0vuiIWWAn6O4LkKUNWnLfWA88+ZW4wUUFD6I346HyI/R7JPf/u4T3q8RHcGbKegsjCdAYcya+POcGpgHUOXstT/KC895uZiZH5JDyeV0pZmpeR1zOMXyKj0pHxmhhRUUW8PR4CebIaMdxY+NFOiyLaK80lxjRKYQM22OBgKtxLlwz7C7BSyPq/jD7w69ZvEOaJ4o6yHcxZ+u/feScldZANytIboq9Wf0su1eirdc0QGQ/uxfh+peINlRvGgaMqjqDIXTl2d4BNFSyp/Jwqa+/SMrsk7R+S2wOROALJmew1idaYlUGPQsYPDxUe1R6SPwZ0ZsFmHfvT1koD2/uqc3AwBGUcY4U5egM8i9L+UhOe3Ir67ARDP0E/fGUhUS4CrmfUyPJcLAZEnAEyOYPp6YaDziHwOmXVh8q36O+yvz8/vBVhlE28Pv9GdEVEQ2Fc8mTEHEjy20FMSEnODjHwA9SCGqBEThY5ligFRQqRz6QPI+SLMkHkm+UHp0crPwOfiGjR3xdcaRXsLJmvoBlweF851zUFy19QAUjFjAp/U7uW9kikDnQ8n3pbpftnyGEfaJgXeH/6FLggTshwdkgXw8Z0n44XbX6T02+8hRchqIzoA4nkSGXDDt7PsTAfKSiU45KDT0Wwv95RY9426GNu1GEeIg1GoFX7VZLt2w4ADj4+bpQZmN02Ec89UgNHeEF8NP+fc+Uz5wdJu7uTFrdVRyca0JgP4Mdoew1FsiZprmwiuNciJRDQ4qIut3Gg/g8/kIldhRhOERvOOtkm6g5lpKKBNu6zo9ov1/N/JvgJKZuR13Fdeiun5mSfuYwB4ia6CgWrPJNnb69LGh15h6WZNHNJWmqjuCdyj5XGTIoeeEpOWa7WUL5D1OfqhRwtYxf/961T8yal7X4VVlJZxf+wgF4JuUhFQKa0EX383Uu3YEJE2+W10oC4AXQBfSoapTFJNsuefNZZA6wMB0R+faeToCMXFP6+AiJZKIS/fjpt6gNCIOL8oh4PCq2J6SMb6wAcZCVGJP+zXKY0zmtUBedMQfNO2/XE1IYcbnD40Ulz4wz8P4oG+esfYGP8LoAiRqxC1EUcAE9AA/FVJayA/7mDKfljzC7BII4C/cXIDMqi6UgNS21Cx2gwi/Tp+LQwlidvbHsgxJMQJM/TI1okcZ/FCsmqEI1qm8q59ArYKgAXdUnM+1Y6e3HrMH0nw8uOAAujJIALprhnQZ9Wad8Rp3p+8ITh2D/0DAN1CNzIOpfvioJbzlQhYtlodW0BhVruSVwZw1FXhCe2Vb4Iz4LYg17alV9KBe4zTdcX9E38G9uY48ZnuUyH93cEKnikvWOAQGj+OHbYeHnkdptM/I8XaWkku40Dg6KaIEwNRnrbkiIvNzgkyKBFGo6Fzt/XAdBowuM6L4v/nSrjxvKcsZZhOmj4CB44MYO2ndB3wRyo1OX1Q6N/t8K4Qi4h25733pzaz0zJdBfe0GRtFkvXGgFyC0hUU91PTdbfcRNKyixmDggb3kw9+eagW8gMgtJyT2ExF96hJNZhzKRiSH1teDL/tqNYvupZmcZyc7zQDcIELNK/4nFUIWuP3qbs0AswclWmr/ezeWWBwBGkshdhgEffpmFafWBZFmuyZc+Ghv70mMfz5bQ/xBom4D18QnysFC1p7DI1dFK2BEYxY2ZO38YydvzvFup4leQEiFwD9ZcKW5Sgd13ab6xuaW5yZ1GvoJo4SSCRGn08Sko3guWoB1Y9gfX1nn2RxGy6chPrxgKeybEIiaL7BS68kOsspbRhh0Q+1h+/2kmoXR4ilDOHZfzSR8mF1JmLKeac4JWDGotnujdFYWNghIVvKyXnBDLaQZpUIEwHk4hgYpFDFPHi29iKiilW0T/zAoT5iX89/gf/XMK1ovE0XQVHBkW01RrKQE0V5OtVb2Jw+Guon3S3Bx7Uqx+MmWiE6ysRNx4G+QA4B1DYcvYfUAiHVoT4crTTRPwpf98uO9wUMEmvJKA4TVO0tjpCHedLpXj4owejfAmUcTdx9WAUb1CmKBQ0HmvwxiQM9uqOjCOGDCGtPFC8B5bUs5jkyGYjIrEU8V7/6b/G+yy2kNDP1wsKEI+qBq+OmEcLQoU8SFjYrvBnHc/UhiGmKZmY4gt6Agah75h5PX4/g/bFkVmwAAAAAAAAAA=\"]', NULL, NULL, NULL, '2026-04-04 05:41:04.080811', '2026-04-04 05:41:04.080827', 13, 2, 4, NULL),
(17, '2026-04-03 22:42:00.000000', 'ddddd111111111', '', '', 'ddd', '', '', '[\"data:image/png;base64,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\"]', NULL, NULL, NULL, '2026-04-04 05:42:34.302072', '2026-04-04 05:42:34.302083', 13, 1, 4, 92),
(18, '2026-04-03 22:46:00.000000', '1232e', 'ddddddddd', '', '', '', '', '[]', NULL, NULL, NULL, '2026-04-04 05:46:12.365101', '2026-04-04 05:46:12.365116', 13, 1, 4, NULL);

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
(4, '2026-03-23 11:20:00.000000', 'Khác', 'Phát hiện cỏ dại kháng thuốc', '[]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 1, 1),
(6, '2026-04-03 12:40:18.764000', 'Sâu bệnh', 'dddddddddddddddddddddddddd', '[\"blob:http://localhost:3000/cfa8879d-c824-4b7a-9bf8-4b92b397be6c\"]', '2026-04-03 12:40:18.777252', '2026-04-03 12:40:18.777281', 4, 1);

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
  `updated_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `name`, `type`, `active_ingredient`, `is_vietgap`, `unit`, `quantity`, `min_stock`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Champion', 'Thuốc BVTV', 'Copper Hydroxide', 1, 'kg', 50.00, 5.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(2, 'Najat 3.6', 'Thuốc BVTV', 'Abamectin', 1, 'lít', 20.00, 2.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(3, 'Phân gà Nhật Bản', 'Phân bón', NULL, 1, 'kg', 100.00, 10.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(4, 'Phân Lân Văn Điển', 'Phân bón', NULL, 1, 'kg', 200.00, 20.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(5, 'NPK 30-10-10', 'Phân bón', NULL, 1, 'kg', 150.00, 15.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(6, 'Tado 4.0', 'Thuốc BVTV', 'Picoxystrobin', 1, 'lít', 30.00, 3.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(7, 'Bình Dân', 'Thuốc BVTV', 'Abamectin', 1, 'kg', 25.00, 2.50, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(8, 'Dipimai 150 EC', 'Thuốc BVTV', 'Pyridaben', 1, 'lít', 15.00, 1.50, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(9, 'Humic', 'Phân bón', 'Axit Humic', 1, 'kg', 40.00, 4.00, '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', 'active'),
(14, 'Phân hữu cơ S001', 'Phân bón', 'Nitơ', 1, 'kg', 100.00, 0.00, '2026-04-04 01:20:29.503871', '2026-04-04 01:20:29.503924', 'active'),
(15, 'Thuốc trừ sâu S002', 'Thuốc', 'Permethrin', 1, 'kg', 50.00, 0.00, '2026-04-04 01:20:29.510506', '2026-04-04 01:20:29.510545', 'active'),
(16, 'Phân lá S003', 'Phân bón', 'Phốt pho', 1, 'kg', 80.00, 0.00, '2026-04-04 01:20:29.546770', '2026-04-04 01:20:29.546802', 'active'),
(17, 'Diệt bệnh S004', 'Thuốc', 'Mancozeb', 1, 'kg', 40.00, 0.00, '2026-04-04 01:20:29.550343', '2026-04-04 01:20:29.550375', 'active'),
(18, 'Đạm lúa S005', 'Phân bón', 'Urea', 1, 'kg', 200.00, 0.00, '2026-04-04 01:20:29.591898', '2026-04-04 01:20:29.591927', 'active'),
(19, 'Thuốc lúa S006', 'Thuốc', 'Carbofuran', 1, 'kg', 60.00, 0.00, '2026-04-04 01:20:29.596578', '2026-04-04 01:20:29.596616', 'active'),
(20, 'Dam lua S005', 'Phan bon', 'Urea', 1, 'kg', 200.00, 0.00, '2026-04-04 01:24:28.544012', '2026-04-04 01:24:28.544044', 'active');

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
  `updated_at` datetime(6) NOT NULL,
  `certificate_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`certificate_files`)),
  `admin_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `planting_zones`
--

INSERT INTO `planting_zones` (`id`, `crop_type`, `name`, `lots`, `created_at`, `updated_at`, `certificate_files`, `admin_id`) VALUES
(1, 'Sầu riêng', 'Khu vực Sầu riêng 1', '[\"Lô 1\", \"Lô 2\"]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', '[]', 1),
(2, 'Bưởi', 'Khu vực Bưởi 1', '[\"Lô 3\"]', '2026-03-27 22:46:19.000000', '2026-03-27 22:46:19.000000', '[]', 1),
(5, 'Cà phê', 'eeeeeeeee', '[{\"id\": \"l1\", \"name\": \"L\\u00f4 1\", \"area\": 1.2, \"coordinates\": \"10,10 90,10 90,60 10,60\", \"center\": {\"x\": 50, \"y\": 35}}, {\"id\": \"l2\", \"name\": \"L\\u00f4 2\", \"area\": 0.8, \"coordinates\": \"100,10 180,10 180,60 100,60\", \"center\": {\"x\": 140, \"y\": 35}}, {\"id\": \"l3\", \"name\": \"L\\u00f4 3\", \"area\": 1.5, \"coordinates\": \"10,70 180,70 180,140 10,140\", \"center\": {\"x\": 95, \"y\": 105}}]', '2026-04-01 11:36:22.634807', '2026-04-01 11:36:22.634839', '[]', 1),
(6, 'Cà phê', 'e', '[{\"id\": \"l1\", \"name\": \"L\\u00f4 1\", \"area\": 1.2, \"coordinates\": \"10,10 90,10 90,60 10,60\", \"center\": {\"x\": 50, \"y\": 35}}, {\"id\": \"l2\", \"name\": \"L\\u00f4 2\", \"area\": 0.8, \"coordinates\": \"100,10 180,10 180,60 100,60\", \"center\": {\"x\": 140, \"y\": 35}}, {\"id\": \"l3\", \"name\": \"L\\u00f4 3\", \"area\": 1.5, \"coordinates\": \"10,70 180,70 180,140 10,140\", \"center\": {\"x\": 95, \"y\": 105}}]', '2026-04-01 11:55:46.396131', '2026-04-01 11:55:46.396168', '[\"/media/planting_zone_certificates/ef860ce8d1f846ffa36d36b676de38eb_cach-xac-dinh-huong-dat-tren-so-do-5.jpg\"]', 1),
(7, 'Hồ tiêu', 'đ1ddd', '[{\"id\": \"lot_1775233828588\", \"name\": \"L\\u00f4 1\", \"area\": 2, \"coordinates\": \"10.501248738551876,107.39481733063995 10.50141743052375,107.39779831538647 10.50015223849085,107.39762674791909 10.49943529404036,107.39430262823765\", \"center\": {\"x\": 10.501248738551876, \"y\": 107.39481733063995}, \"latLngs\": [[10.501248738551876, 107.39481733063995], [10.50141743052375, 107.39779831538647], [10.50015223849085, 107.39762674791909], [10.49943529404036, 107.39430262823765]]}, {\"id\": \"lot_1775233845800\", \"name\": \"L\\u00f4 2\", \"area\": 2, \"coordinates\": \"10.501354171045085,107.3993305081495 10.500384190751197,107.3993305081495 10.501944592342406,107.40248306036351 10.50335738158257,107.40153943929266\", \"center\": {\"x\": 10.501354171045085, \"y\": 107.3993305081495}, \"latLngs\": [[10.501354171045085, 107.3993305081495], [10.500384190751197, 107.3993305081495], [10.501944592342406, 107.40248306036351], [10.50335738158257, 107.40153943929266]]}]', '2026-04-03 16:30:46.768181', '2026-04-03 16:30:46.768211', '[]', 8),
(8, 'Sầu riêng', '1vf', '[{\"id\": \"lot_1775234372404\", \"name\": \"L\\u00f4 1\", \"area\": 2, \"coordinates\": \"10.502071111045089,107.39623276224624 10.502071111045089,107.3974980723185 10.50072157554648,107.39513901964138 10.500658315925403,107.39702626178305\", \"center\": {\"x\": 10.502071111045089, \"y\": 107.39623276224624}, \"latLngs\": [[10.502071111045089, 107.39623276224624], [10.502071111045089, 107.3974980723185], [10.50072157554648, 107.39513901964138], [10.500658315925403, 107.39702626178305]]}, {\"id\": \"lot_1775234377251\", \"name\": \"L\\u00f4 2\", \"area\": 2, \"coordinates\": \"10.501586122403527,107.40130353402493 10.501438517013751,107.40434885657179 10.499245514348694,107.40398427570351 10.498676174574733,107.4007459397558\", \"center\": {\"x\": 10.501586122403527, \"y\": 107.40130353402493}, \"latLngs\": [[10.501586122403527, 107.40130353402493], [10.501438517013751, 107.40434885657179], [10.499245514348694, 107.40398427570351], [10.498676174574733, 107.4007459397558]]}, {\"id\": \"lot_1775234381051\", \"name\": \"L\\u00f4 3\", \"area\": 2.5, \"coordinates\": \"10.498676174574733,107.39600638846811 10.499414207413711,107.39772206314238 10.49865508789629,107.39890158948094 10.497284450713662,107.39885869761409 10.497284450713662,107.39885869761409\", \"center\": {\"x\": 10.498676174574733, \"y\": 107.39600638846811}, \"latLngs\": [[10.498676174574733, 107.39600638846811], [10.499414207413711, 107.39772206314238], [10.49865508789629, 107.39890158948094], [10.497284450713662, 107.39885869761409], [10.497284450713662, 107.39885869761409]]}]', '2026-04-03 16:39:41.912468', '2026-04-03 16:39:41.912496', '[]', 8),
(9, 'Hồ tiêu', 'ư', '[{\"id\": \"l1\", \"name\": \"L\\u00f4 1\", \"area\": 1.2, \"coordinates\": \"10,10 90,10 90,60 10,60\", \"center\": {\"x\": 50, \"y\": 35}, \"latLngs\": [[10.5, 107.4], [10.501, 107.4], [10.501, 107.401], [10.5, 107.401]]}, {\"id\": \"l2\", \"name\": \"L\\u00f4 2\", \"area\": 0.8, \"coordinates\": \"100,10 180,10 180,60 100,60\", \"center\": {\"x\": 140, \"y\": 35}, \"latLngs\": [[10.5, 107.402], [10.501, 107.402], [10.501, 107.403], [10.5, 107.403]]}, {\"id\": \"l3\", \"name\": \"L\\u00f4 3\", \"area\": 1.5, \"coordinates\": \"10,70 180,70 180,140 10,140\", \"center\": {\"x\": 95, \"y\": 105}, \"latLngs\": [[10.498, 107.4], [10.499, 107.4], [10.499, 107.403], [10.498, 107.403]]}]', '2026-04-03 17:04:17.446235', '2026-04-03 17:04:17.446268', '[\"/media/planting_zone_certificates/ce70f1de7ec14df391c0a4727578616a_R.png\"]', 8),
(10, 'Rau sạch', 'Mã vùng 001', '[{\"name\": \"L\\u00f4 A1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 A2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:20:29.487832', '2026-04-04 01:20:29.487875', '[]', 10),
(11, 'Rau cải', 'Mã vùng 002', '[{\"name\": \"L\\u00f4 B1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 B2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 B3\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:20:29.494897', '2026-04-04 01:20:29.495000', '[]', 10),
(12, 'Rau dùi', 'Mã vùng 001', '[{\"name\": \"L\\u00f4 C1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 C2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:20:29.537882', '2026-04-04 01:20:29.537916', '[]', 11),
(13, 'Rau xà lách', 'Mã vùng 002', '[{\"name\": \"L\\u00f4 D1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:20:29.542414', '2026-04-04 01:20:29.542448', '[]', 11),
(14, 'Lúa hữu cơ', 'Mã vùng 001', '[{\"name\": \"L\\u00f4 E1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 E2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 E3\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:20:29.582260', '2026-04-04 01:20:29.582292', '[]', 12),
(15, 'Lúa mưa', 'Mã vùng 002', '[{\"name\": \"L\\u00f4 F1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"L\\u00f4 F2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:20:29.587183', '2026-04-04 01:20:29.587217', '[]', 12),
(16, 'Rau sach', 'Zone 001', '[{\"name\": \"Lot A1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot A2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:24:28.472722', '2026-04-04 01:24:28.472754', '[]', 10),
(17, 'Rau cai', 'Zone 002', '[{\"name\": \"Lot B1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot B2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot B3\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:24:28.485001', '2026-04-04 01:24:28.485027', '[]', 10),
(18, 'Rau dui', 'Zone 001', '[{\"name\": \"Lot C1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot C2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:24:28.507287', '2026-04-04 01:24:28.507335', '[]', 11),
(19, 'Rau xa lach', 'Zone 002', '[{\"name\": \"Lot D1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:24:28.515430', '2026-04-04 01:24:28.515508', '[]', 11),
(20, 'Lua huu co', 'Zone 001', '[{\"name\": \"Lot E1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot E2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot E3\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:24:28.534504', '2026-04-04 01:24:28.534539', '[]', 12),
(21, 'Lua mua', 'Zone 002', '[{\"name\": \"Lot F1\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}, {\"name\": \"Lot F2\", \"area\": 5.0, \"coordinates\": \"20.9,105.7 20.95,105.7 20.95,105.75 20.9,105.75\", \"latLngs\": [[20.9, 105.7], [20.95, 105.7], [20.95, 105.75], [20.9, 105.75]]}]', '2026-04-04 01:24:28.539461', '2026-04-04 01:24:28.539495', '[]', 12),
(22, 'Sầu riêng', 'đ', '[{\"id\": \"l1\", \"name\": \"L\\u00f4 1\", \"area\": 1.2, \"coordinates\": \"10,10 90,10 90,60 10,60\", \"center\": {\"x\": 50, \"y\": 35}, \"latLngs\": [[10.5, 107.4], [10.501, 107.4], [10.501, 107.401], [10.5, 107.401]]}, {\"id\": \"l2\", \"name\": \"L\\u00f4 2\", \"area\": 0.8, \"coordinates\": \"100,10 180,10 180,60 100,60\", \"center\": {\"x\": 140, \"y\": 35}, \"latLngs\": [[10.5, 107.402], [10.501, 107.402], [10.501, 107.403], [10.5, 107.403]]}, {\"id\": \"l3\", \"name\": \"L\\u00f4 3\", \"area\": 1.5, \"coordinates\": \"10,70 180,70 180,140 10,140\", \"center\": {\"x\": 95, \"y\": 105}, \"latLngs\": [[10.498, 107.4], [10.499, 107.4], [10.499, 107.403], [10.498, 107.403]]}]', '2026-04-04 02:02:00.798661', '2026-04-04 02:02:00.798688', '[\"/media/planting_zone_certificates/7a060c17438d4f8884703afea5c2819c_Screenshot%202026-03-23%20093602.png\"]', 8),
(23, 'Hồ tiêu', 'd', '[{\"id\": \"lot_1775281534994\", \"name\": \"L\\u00f4 1\", \"area\": 2.5, \"coordinates\": \"10.5003209310611,107.39689758634613 10.500363104189278,107.39700481601325 10.498760521274061,107.39694047821297 10.499709420056,107.39887061222151 10.500468536984537,107.39899928782208\", \"center\": {\"x\": 10.5003209310611, \"y\": 107.39689758634613}, \"latLngs\": [[10.5003209310611, 107.39689758634613], [10.500363104189278, 107.39700481601325], [10.498760521274061, 107.39694047821297], [10.499709420056, 107.39887061222151], [10.500468536984537, 107.39899928782208]]}]', '2026-04-04 05:45:35.929539', '2026-04-04 05:45:35.929601', '[]', 13);

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
  `created_at` datetime(6) NOT NULL,
  `admin_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `icon`, `color`, `requires_materials`, `default_values`, `created_at`, `admin_id`) VALUES
(1, 'Rửa vườn', 'Droplets', 'bg-blue-100 text-blue-600', 1, '{\"task\": \"R\\u1eeda v\\u01b0\\u1eddn\", \"pest\": \"heloooo\", \"method\": \"Champion\", \"active_ingredient\": \"Copper Hydroxide\", \"dosage\": \"2kg / 1000 l\\u00edt n\\u01b0\\u1edbc\", \"quarantine_time\": \"7 Ng\\u00e0y\", \"fertilizer\": \"wwwwwwwww\", \"activeIngredient\": \"ddddddeeeee\", \"quarantineTime\": \"eeeeeeeeeee\"}', '2026-03-27 22:46:19.000000', 13),
(15, 'fff1', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"fff1\", \"pest\": \"1233232\", \"method\": \"df\", \"fertilizer\": \"dd\", \"activeIngredient\": \"dd\", \"dosage\": \"65\", \"quarantineTime\": \"2\"}', '2026-04-03 08:57:46.460545', 9),
(16, 'ddddddddddddd', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"ddddddddddddd\", \"pest\": \"\\u0111\", \"method\": \"\\u0111\", \"fertilizer\": \"\\u0111\"}', '2026-04-04 03:37:35.363637', 13),
(17, 'c bdufcvc', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"c bdufcvc\", \"pest\": \"ddddddddd\", \"fertilizer\": \"edf\", \"method\": \"ffdf\", \"activeIngredient\": \"\\u0111vdxds\", \"dosage\": \"dfd\", \"quarantineTime\": \"\\u0111\"}', '2026-04-04 03:37:43.587155', 9),
(18, 'dddd', 'Leaf', 'bg-emerald-100 text-emerald-600', 0, '{\"task\": \"dddd\"}', '2026-04-04 04:41:45.042238', 13),
(19, 'ddd', 'Leaf', 'bg-emerald-100 text-emerald-600', 0, '{\"task\": \"ddd\"}', '2026-04-04 04:51:26.363452', 8),
(20, 'dsfdfvf', 'Leaf', 'bg-emerald-100 text-emerald-600', 0, '{\"task\": \"dsfdfvf\"}', '2026-04-04 04:58:33.391366', 8),
(21, 'dgv', 'Leaf', 'bg-emerald-100 text-emerald-600', 0, '{\"task\": \"dgv\"}', '2026-04-04 04:58:39.076809', 8),
(30, 'Tưới nước', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"T\\u01b0\\u1edbi n\\u01b0\\u1edbc\"}', '2026-04-04 05:04:58.347137', 1),
(31, 'Làm sạch cỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"L\\u00e0m s\\u1ea1ch c\\u1ecf\"}', '2026-04-04 05:04:58.349463', 1),
(32, 'Cắt tỉa cành', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"C\\u1eaft t\\u1ec9a c\\u00e0nh\"}', '2026-04-04 05:04:58.351295', 1),
(33, 'Rửa vườn', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1eeda v\\u01b0\\u1eddn\"}', '2026-04-04 05:04:58.352932', 1),
(34, 'Bón phân vi sinh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n vi sinh\"}', '2026-04-04 05:04:58.356199', 1),
(35, 'Bón phân Lân', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n L\\u00e2n\"}', '2026-04-04 05:04:58.357968', 1),
(36, 'Bón phân NPK', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n NPK\"}', '2026-04-04 05:04:58.359649', 1),
(37, 'Đổ gốc', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"\\u0110\\u1ed5 g\\u1ed1c\"}', '2026-04-04 05:04:58.361272', 1),
(38, 'Sâu Rầy (Najat)', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"S\\u00e2u R\\u1ea7y (Najat)\"}', '2026-04-04 05:04:58.365125', 1),
(39, 'Rầy xanh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1ea7y xanh\"}', '2026-04-04 05:04:58.367165', 1),
(40, 'Phun Rệp', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun R\\u1ec7p\"}', '2026-04-04 05:04:58.368993', 1),
(41, 'Phun Nhện đỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun Nh\\u1ec7n \\u0111\\u1ecf\"}', '2026-04-04 05:04:58.371413', 1),
(42, 'Xử lý chất thải', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"X\\u1eed l\\u00fd ch\\u1ea5t th\\u1ea3i\"}', '2026-04-04 05:04:58.374759', 1),
(43, 'Quản lý vật tư', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Qu\\u1ea3n l\\u00fd v\\u1eadt t\\u01b0\"}', '2026-04-04 05:04:58.376495', 1),
(44, 'Vệ sinh kho', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"V\\u1ec7 sinh kho\"}', '2026-04-04 05:04:58.378217', 1),
(45, 'An toàn lao động', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"An to\\u00e0n lao \\u0111\\u1ed9ng\"}', '2026-04-04 05:04:58.379883', 1),
(46, 'Tưới nước', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"T\\u01b0\\u1edbi n\\u01b0\\u1edbc\"}', '2026-04-04 05:04:58.385050', 8),
(47, 'Làm sạch cỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"L\\u00e0m s\\u1ea1ch c\\u1ecf\"}', '2026-04-04 05:04:58.387130', 8),
(48, 'Cắt tỉa cành', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"C\\u1eaft t\\u1ec9a c\\u00e0nh\"}', '2026-04-04 05:04:58.389201', 8),
(49, 'Rửa vườn', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1eeda v\\u01b0\\u1eddn\"}', '2026-04-04 05:04:58.391226', 8),
(50, 'Bón phân vi sinh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n vi sinh\"}', '2026-04-04 05:04:58.394309', 8),
(51, 'Bón phân Lân', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n L\\u00e2n\"}', '2026-04-04 05:04:58.396023', 8),
(52, 'Bón phân NPK', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n NPK\"}', '2026-04-04 05:04:58.397795', 8),
(53, 'Đổ gốc', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"\\u0110\\u1ed5 g\\u1ed1c\"}', '2026-04-04 05:04:58.399957', 8),
(54, 'Sâu Rầy (Najat)', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"S\\u00e2u R\\u1ea7y (Najat)\"}', '2026-04-04 05:04:58.403317', 8),
(55, 'Rầy xanh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1ea7y xanh\"}', '2026-04-04 05:04:58.405174', 8),
(56, 'Phun Rệp', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun R\\u1ec7p\"}', '2026-04-04 05:04:58.406904', 8),
(57, 'Phun Nhện đỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun Nh\\u1ec7n \\u0111\\u1ecf\"}', '2026-04-04 05:04:58.408538', 8),
(58, 'Xử lý chất thải', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"X\\u1eed l\\u00fd ch\\u1ea5t th\\u1ea3i\"}', '2026-04-04 05:04:58.411714', 8),
(59, 'Quản lý vật tư', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Qu\\u1ea3n l\\u00fd v\\u1eadt t\\u01b0\"}', '2026-04-04 05:04:58.413452', 8),
(60, 'Vệ sinh kho', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"V\\u1ec7 sinh kho\"}', '2026-04-04 05:04:58.415584', 8),
(61, 'An toàn lao động', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"An to\\u00e0n lao \\u0111\\u1ed9ng\"}', '2026-04-04 05:04:58.417772', 8),
(62, 'Tưới nước', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"T\\u01b0\\u1edbi n\\u01b0\\u1edbc\"}', '2026-04-04 05:04:58.422214', 9),
(63, 'Làm sạch cỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"L\\u00e0m s\\u1ea1ch c\\u1ecf\"}', '2026-04-04 05:04:58.423926', 9),
(64, 'Cắt tỉa cành', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"C\\u1eaft t\\u1ec9a c\\u00e0nh\"}', '2026-04-04 05:04:58.425730', 9),
(65, 'Rửa vườn', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1eeda v\\u01b0\\u1eddn\"}', '2026-04-04 05:04:58.427405', 9),
(66, 'Bón phân vi sinh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n vi sinh\"}', '2026-04-04 05:04:58.430742', 9),
(67, 'Bón phân Lân', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n L\\u00e2n\"}', '2026-04-04 05:04:58.432841', 9),
(68, 'Bón phân NPK', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n NPK\"}', '2026-04-04 05:04:58.434608', 9),
(69, 'Đổ gốc', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"\\u0110\\u1ed5 g\\u1ed1c\"}', '2026-04-04 05:04:58.436218', 9),
(70, 'Sâu Rầy (Najat)', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"S\\u00e2u R\\u1ea7y (Najat)\"}', '2026-04-04 05:04:58.439472', 9),
(71, 'Rầy xanh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1ea7y xanh\"}', '2026-04-04 05:04:58.441124', 9),
(72, 'Phun Rệp', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun R\\u1ec7p\"}', '2026-04-04 05:04:58.442769', 9),
(73, 'Phun Nhện đỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun Nh\\u1ec7n \\u0111\\u1ecf\"}', '2026-04-04 05:04:58.444379', 9),
(74, 'Xử lý chất thải', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"X\\u1eed l\\u00fd ch\\u1ea5t th\\u1ea3i\"}', '2026-04-04 05:04:58.447839', 9),
(75, 'Quản lý vật tư', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Qu\\u1ea3n l\\u00fd v\\u1eadt t\\u01b0\"}', '2026-04-04 05:04:58.449639', 9),
(76, 'Vệ sinh kho', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"V\\u1ec7 sinh kho\"}', '2026-04-04 05:04:58.451358', 9),
(77, 'An toàn lao động', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"An to\\u00e0n lao \\u0111\\u1ed9ng\"}', '2026-04-04 05:04:58.453141', 9),
(78, 'Tưới nước', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"T\\u01b0\\u1edbi n\\u01b0\\u1edbc\"}', '2026-04-04 05:04:58.457546', 13),
(79, 'Làm sạch cỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"L\\u00e0m s\\u1ea1ch c\\u1ecf\"}', '2026-04-04 05:04:58.459202', 13),
(80, 'Cắt tỉa cành', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"C\\u1eaft t\\u1ec9a c\\u00e0nh\"}', '2026-04-04 05:04:58.460973', 13),
(81, 'Bón phân vi sinh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n vi sinh\"}', '2026-04-04 05:04:58.466557', 13),
(82, 'Bón phân Lân', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n L\\u00e2n\"}', '2026-04-04 05:04:58.468295', 13),
(83, 'Bón phân NPK', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"B\\u00f3n ph\\u00e2n NPK\"}', '2026-04-04 05:04:58.469936', 13),
(84, 'Đổ gốc', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"\\u0110\\u1ed5 g\\u1ed1c\"}', '2026-04-04 05:04:58.471565', 13),
(85, 'Sâu Rầy (Najat)', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"S\\u00e2u R\\u1ea7y (Najat)\"}', '2026-04-04 05:04:58.474626', 13),
(86, 'Rầy xanh', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"R\\u1ea7y xanh\"}', '2026-04-04 05:04:58.476375', 13),
(87, 'Phun Rệp', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun R\\u1ec7p\"}', '2026-04-04 05:04:58.478076', 13),
(88, 'Phun Nhện đỏ', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Phun Nh\\u1ec7n \\u0111\\u1ecf\"}', '2026-04-04 05:04:58.480209', 13),
(89, 'Xử lý chất thải', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"X\\u1eed l\\u00fd ch\\u1ea5t th\\u1ea3i\"}', '2026-04-04 05:04:58.484124', 13),
(90, 'Quản lý vật tư', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"Qu\\u1ea3n l\\u00fd v\\u1eadt t\\u01b0\"}', '2026-04-04 05:04:58.485962', 13),
(91, 'Vệ sinh kho', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"V\\u1ec7 sinh kho\"}', '2026-04-04 05:04:58.487772', 13),
(92, 'An toàn lao động', 'Leaf', 'bg-emerald-100 text-emerald-600', 1, '{\"task\": \"An to\\u00e0n lao \\u0111\\u1ed9ng\"}', '2026-04-04 05:04:58.489397', 13),
(93, 'dddddddddddddd', 'Leaf', 'bg-emerald-100 text-emerald-600', 0, '{\"task\": \"dddddddddddddd\"}', '2026-04-04 05:23:29.925329', 8),
(100, 'helo', 'Leaf', 'bg-emerald-100 text-emerald-600', 0, '{\"task\": \"helo\"}', '2026-04-04 05:59:13.450673', 13);

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
(16, 'Chăm sóc cơ bản', '[\"78\", \"79\", \"80\", \"1\"]', '2026-04-04 04:50:28.471498'),
(17, 'Phân bón & Dinh dưỡng', '[\"81\", \"82\", \"83\", \"84\"]', '2026-04-04 04:50:28.473826'),
(18, 'Phòng trừ sâu bệnh', '[\"85\", \"86\", \"87\", \"88\"]', '2026-04-04 04:50:28.475513'),
(19, 'Quản lý & Vệ sinh bảo hộ', '[\"100\"]', '2026-04-04 04:50:28.477205');

-- --------------------------------------------------------

--
-- Table structure for table `vietgap_registrations`
--

CREATE TABLE `vietgap_registrations` (
  `id` bigint(20) NOT NULL,
  `registration_type` varchar(20) NOT NULL,
  `region_code` varchar(100) DEFAULT NULL,
  `document_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`document_files`)),
  `status` varchar(20) NOT NULL,
  `notes` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `admin_id` bigint(20) NOT NULL,
  `crop_type` varchar(100) DEFAULT NULL,
  `production_quantity` varchar(100) DEFAULT NULL,
  `planting_zone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vietgap_registrations`
--

INSERT INTO `vietgap_registrations` (`id`, `registration_type`, `region_code`, `document_files`, `status`, `notes`, `created_at`, `updated_at`, `admin_id`, `crop_type`, `production_quantity`, `planting_zone`) VALUES
(1, 'vietgap', '', '[\"HoSo_VIETGAP_dfd.pdf\"]', 'approved', 'Hồ sơ mới tạo', '2026-04-03 10:30:08.814632', '2026-04-03 11:55:28.798769', 8, NULL, NULL, NULL),
(2, 'vietgap', '', '[\"HoSo_VIETGAP_Qu\\u1ea3ntr\\u1ecbvi\\u00eanHTX.pdf\"]', 'pending', 'Hồ sơ mới tạo', '2026-04-03 12:07:15.399458', '2026-04-03 12:07:15.399492', 1, 'fddd', '34', 'Khu vực Sầu riêng 1');

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
  ADD UNIQUE KEY `google_email` (`google_email`),
  ADD KEY `farmers_admin_id_ea57f8ff_fk_admins_id` (`admin_id`);

--
-- Indexes for table `farms`
--
ALTER TABLE `farms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_id` (`admin_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `planting_zones_admin_id_8a975b3a_fk_admins_id` (`admin_id`);

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
  ADD UNIQUE KEY `tasks_admin_id_name` (`admin_id`,`name`);

--
-- Indexes for table `task_categories`
--
ALTER TABLE `task_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vietgap_registrations`
--
ALTER TABLE `vietgap_registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vietgap_registrations_admin_id_e8921863_fk_admins_id` (`admin_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `farmers`
--
ALTER TABLE `farmers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `farms`
--
ALTER TABLE `farms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `farm_logs`
--
ALTER TABLE `farm_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `incident_reports`
--
ALTER TABLE `incident_reports`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lots`
--
ALTER TABLE `lots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `planting_zones`
--
ALTER TABLE `planting_zones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `task_categories`
--
ALTER TABLE `task_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `vietgap_registrations`
--
ALTER TABLE `vietgap_registrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- Constraints for table `farmers`
--
ALTER TABLE `farmers`
  ADD CONSTRAINT `farmers_admin_id_ea57f8ff_fk_admins_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Constraints for table `farms`
--
ALTER TABLE `farms`
  ADD CONSTRAINT `farms_admin_id_47814585_fk_admins_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

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

--
-- Constraints for table `planting_zones`
--
ALTER TABLE `planting_zones`
  ADD CONSTRAINT `planting_zones_admin_id_8a975b3a_fk_admins_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_admin_id_8d1ce642_fk_admins_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Constraints for table `vietgap_registrations`
--
ALTER TABLE `vietgap_registrations`
  ADD CONSTRAINT `vietgap_registrations_admin_id_e8921863_fk_admins_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
