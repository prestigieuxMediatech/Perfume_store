-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: perfume_store
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('85e4f6d1-2437-11f1-9a54-b05cda347089','Owner','admin@gmail.com','$2b$10$Pg5CHLXYJgPzs.6UCZQdJ.3Pi7LkbTWN3AqR9YlCnDn81ZwkkDVsu','2026-03-20 14:03:51','2026-03-20 14:03:51');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `title` varchar(220) NOT NULL,
  `slug` varchar(240) NOT NULL,
  `category_label` varchar(80) DEFAULT 'Journal',
  `excerpt` text NOT NULL,
  `content` longtext NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `author_name` varchar(120) DEFAULT '7EVEN Editorial',
  `read_time_minutes` int DEFAULT '4',
  `is_published` tinyint(1) DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES ('c680b649-3cb2-11f1-8d8f-b05cda347089','Perfume','perfume','Journal','Perfume should be very fragrant','Grok Agents (specifically in the 4.20/4.2 beta) are a multi-agent AI system from xAI that utilizes four specialized agents—Captain Grok (coordinator), Harper (research), Benjamin (math/code), and Lucas (creativity/UX)—to collaborate and debate on a single prompt. This approach aims to reduce hallucinations and improve accuracy, offering high-level reasoning and real-time data from the X platform. \r\nYouTube\r\nYouTube\r\n +2\r\nThis video explains how the different Grok agents work together to produce a final answer:','/uploads/blogs/0f19bcf8-6734-4fa9-9bfe-c3be8137da30-1776687395608.jpg','7EVEN Editorial',3,1,'2026-04-20 17:46:36','2026-04-20 17:46:35','2026-04-20 17:46:35');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `box_allowed_categories`
--

DROP TABLE IF EXISTS `box_allowed_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `box_allowed_categories` (
  `id` varchar(36) NOT NULL,
  `box_id` varchar(36) NOT NULL,
  `category_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `box_id` (`box_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `box_allowed_categories_ibfk_1` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `box_allowed_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `box_allowed_categories`
--

LOCK TABLES `box_allowed_categories` WRITE;
/*!40000 ALTER TABLE `box_allowed_categories` DISABLE KEYS */;
INSERT INTO `box_allowed_categories` VALUES ('9a38cc2c-3e0e-11f1-8d8f-b05cda347089','875d0bce-16ed-4b4e-a219-5c2e0ae258d2','86fc54d1-349a-11f1-98bb-b05cda347089');
/*!40000 ALTER TABLE `box_allowed_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boxes`
--

DROP TABLE IF EXISTS `boxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boxes` (
  `id` varchar(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `cover_image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `items_count` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boxes`
--

LOCK TABLES `boxes` WRITE;
/*!40000 ALTER TABLE `boxes` DISABLE KEYS */;
INSERT INTO `boxes` VALUES ('875d0bce-16ed-4b4e-a219-5c2e0ae258d2','Pick any 3 Perfumes','You can now buy any 3 perfumes at 1000 rs.','/uploads/boxes/25339819-9c02-4b14-9cfa-c094a9b58327-1776836786245.jpg',999.00,3,1,'2026-04-13 11:50:34');
/*!40000 ALTER TABLE `boxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `brands_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES ('35fe1e98-38af-11f1-84bb-b05cda347089','Deor','deor','86fc54d1-349a-11f1-98bb-b05cda347089','2026-04-15 15:11:00'),('86e4e6a0-38b2-11f1-84bb-b05cda347089','Armani','armani','86fc54d1-349a-11f1-98bb-b05cda347089','2026-04-15 15:34:44'),('988fd908-349a-11f1-98bb-b05cda347089','Fogg','fogg','86fc54d1-349a-11f1-98bb-b05cda347089','2026-04-10 10:33:21');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_box_items`
--

DROP TABLE IF EXISTS `cart_box_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_box_items` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `box_id` varchar(36) NOT NULL,
  `quantity` int DEFAULT '1',
  `selections_json` json NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `box_id` (`box_id`),
  CONSTRAINT `cart_box_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_box_items_ibfk_2` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_box_items`
--

LOCK TABLES `cart_box_items` WRITE;
/*!40000 ALTER TABLE `cart_box_items` DISABLE KEYS */;
INSERT INTO `cart_box_items` VALUES ('80d2e9ee-3e12-11f1-8d8f-b05cda347089','9e967fe5-cee6-4c42-bcd3-8067358ac3f6','875d0bce-16ed-4b4e-a219-5c2e0ae258d2',1,'[{\"product_id\": \"3464cd92-c1e4-44be-82af-8f452362aadd\", \"variant_id\": \"48838b99-3c7f-11f1-8d8f-b05cda347089\"}, {\"product_id\": \"960f12f1-0c5e-4c46-8aa1-2a8dc4745c08\", \"variant_id\": \"29935915-3d6d-11f1-8d8f-b05cda347089\"}, {\"product_id\": \"cf3fbd6b-4770-45cf-b075-28dc5a3ce6de\", \"variant_id\": \"3e87c282-3d6d-11f1-8d8f-b05cda347089\"}]',999.00,'2026-04-22 11:44:21');
/*!40000 ALTER TABLE `cart_box_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `variant_id` varchar(36) NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart` (`user_id`,`variant_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(100) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('17305f1b-38af-11f1-84bb-b05cda347089','Body Wash','body-wash','2026-04-15 15:10:08'),('86fc54d1-349a-11f1-98bb-b05cda347089','Perfume','perfume','2026-04-10 10:32:51'),('8c1bf4ac-349a-11f1-98bb-b05cda347089','Body Mist','body-mist','2026-04-10 10:33:00'),('8fcfe4fe-349a-11f1-98bb-b05cda347089','Attar','attar','2026-04-10 10:33:06');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_box_details`
--

DROP TABLE IF EXISTS `order_box_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_box_details` (
  `id` varchar(36) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `box_id` varchar(36) NOT NULL,
  `box_name` varchar(200) NOT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `selections_json` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_box_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_box_details`
--

LOCK TABLES `order_box_details` WRITE;
/*!40000 ALTER TABLE `order_box_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_box_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` varchar(40) NOT NULL DEFAULT (uuid()),
  `order_id` varchar(40) NOT NULL,
  `product_id` varchar(40) NOT NULL,
  `variant_id` varchar(40) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_details_order` (`order_id`),
  KEY `idx_order_details_product` (`product_id`),
  KEY `idx_order_details_variant` (`variant_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES ('6b1305a1-3d50-11f1-8d8f-b05cda347089','f22c890c-52a9-4614-8098-691275aaf33f','3464cd92-c1e4-44be-82af-8f452362aadd','48838b99-3c7f-11f1-8d8f-b05cda347089',1,300.00,300.00,300.00,'2026-04-21 12:35:02');
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(40) NOT NULL DEFAULT (uuid()),
  `user_id` varchar(40) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'India',
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(20) NOT NULL DEFAULT 'unpaid',
  `payment_method` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_orders_created_at` (`created_at`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('f22c890c-52a9-4614-8098-691275aaf33f','9e967fe5-cee6-4c42-bcd3-8067358ac3f6','Prestigieux Media Tech','8878787878','info.prestigieux@gmail.com','Taloja','Taloja','Kharghar','Maharashtra','424001','India',300.00,0.00,0.00,0.00,300.00,'pending','unpaid','COD','2026-04-21 12:35:02','2026-04-21 12:35:02');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES ('1e1b04d2-3d6d-11f1-8d8f-b05cda347089','ceb3be35-970c-490b-b22b-b32fdfdac1e0','/uploads/products/3b586851-d7f8-44a2-bb0a-e4a5e75493fc-1776767428935.jpg',1),('29a4d7f3-3d6d-11f1-8d8f-b05cda347089','960f12f1-0c5e-4c46-8aa1-2a8dc4745c08','/uploads/products/f441cb04-8b86-4617-9bd6-64059d00bf3a-1776767448368.jpg',1),('317e0042-3d6d-11f1-8d8f-b05cda347089','7df982b0-12bb-45b9-938b-9b6eceb2e9a2','/uploads/products/a3e100f8-4538-49d5-9e40-7e192cda8529-1776767461528.jpg',1),('3e96625b-3d6d-11f1-8d8f-b05cda347089','cf3fbd6b-4770-45cf-b075-28dc5a3ce6de','/uploads/products/78dbd96c-0f6f-44d3-a2b8-81aa6ca51a77-1776767483517.jpg',1),('4955de86-3d6d-11f1-8d8f-b05cda347089','f0d4b60b-eef9-4ee0-bc41-889394b9b60c','/uploads/products/ff6b4fd6-5c24-43c7-85cd-c4b64bb23ddd-1776767501542.jpg',1),('ebbe5c4b-38b2-11f1-84bb-b05cda347089','3464cd92-c1e4-44be-82af-8f452362aadd','/uploads/products/211f0048-d88d-445f-93d2-206a689a1bec-1776247653468.jpg',1);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` varchar(40) NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `rating` tinyint NOT NULL,
  `title` varchar(120) DEFAULT NULL,
  `comment` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_review_per_user` (`product_id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_product_reviews_product_created` (`product_id`,`created_at` DESC),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_product_reviews_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES ('122fdb46-3e11-11f1-8d8f-b05cda347089','ceb3be35-970c-490b-b22b-b32fdfdac1e0','9e967fe5-cee6-4c42-bcd3-8067358ac3f6',5,'long lasting','best perfume','2026-04-22 11:34:06','2026-04-22 11:34:06'),('d89289e2-3a22-11f1-84bb-b05cda347089','3464cd92-c1e4-44be-82af-8f452362aadd','4f1e2d4b-e57f-422f-b7e7-6401f496f8c4',5,'Good Fragrance','I really liked the fragrance of the perfume','2026-04-17 11:31:16','2026-04-17 11:31:16'),('fc8fb67c-3a1e-11f1-84bb-b05cda347089','3464cd92-c1e4-44be-82af-8f452362aadd','e6455b61-872e-4cd7-b95e-ed6f26455e70',5,'Very Rich Fragrant','Its really very good and suitable for all kind of perfume lovers','2026-04-17 11:03:38','2026-04-17 11:29:22');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `product_id` varchar(36) NOT NULL,
  `size` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES ('3d07b902-3e18-11f1-8d8f-b05cda347089','ceb3be35-970c-490b-b22b-b32fdfdac1e0','25ml',1000.00,NULL,'2026-04-22 12:25:24'),('3e87c282-3d6d-11f1-8d8f-b05cda347089','cf3fbd6b-4770-45cf-b075-28dc5a3ce6de','50ml',1292.00,NULL,'2026-04-21 16:01:23'),('42e68dd8-3e18-11f1-8d8f-b05cda347089','960f12f1-0c5e-4c46-8aa1-2a8dc4745c08','50ml',1000.00,NULL,'2026-04-22 12:25:34'),('47afab26-3e18-11f1-8d8f-b05cda347089','7df982b0-12bb-45b9-938b-9b6eceb2e9a2','100ml',1199.00,NULL,'2026-04-22 12:25:42'),('48838b99-3c7f-11f1-8d8f-b05cda347089','3464cd92-c1e4-44be-82af-8f452362aadd','50ml',599.00,300.00,'2026-04-20 11:38:00'),('49458126-3d6d-11f1-8d8f-b05cda347089','f0d4b60b-eef9-4ee0-bc41-889394b9b60c','25ml',1199.00,NULL,'2026-04-21 16:01:41');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(200) NOT NULL,
  `description` text,
  `category_id` varchar(36) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `brand_id` varchar(36) DEFAULT NULL,
  `group_name` varchar(200) DEFAULT NULL,
  `details_json` longtext,
  `show_on_home` tinyint(1) NOT NULL DEFAULT '0',
  `home_display_order` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('3464cd92-c1e4-44be-82af-8f452362aadd','Seveneven Extrait de Parfum – Inspired by Giorgio Armani Stronger With You','Seveneven Extrait de Parfum is crafted for men who want to stand out. Inspired by the iconic scent DNA of Giorgio Armani Stronger With You, this fragrance delivers a perfect balance of warmth, sweetness, and depth.\r\nFrom the first spray, you get a spicy-fresh opening that quickly evolves into a smooth, sweet heart, finishing with a rich, masculine base that lingers for hours. This is not a subtle fragrance—it’s bold, confident, and designed to get noticed.\r\nPerfect for date nights, evenings, and cooler weather.\r\n','86fc54d1-349a-11f1-98bb-b05cda347089',1,'2026-04-15 15:37:33','2026-04-22 12:23:13','86e4e6a0-38b2-11f1-84bb-b05cda347089','seveneven-extrait-de-parfum-inspired-by-giorgio-armani-stronger-with-you','{\"subtitle\":\"Bold. Addictive. Unforgettable.\",\"why_love_it\":[\"Inspired by Emporio Armani Stronger With You\",\"Extrait de Parfum (high concentration)\",\"Long-lasting (8–10+ hours)\",\"Strong projection & compliment magnet\",\"Luxury scent without the designer price\"],\"detailed_description\":\"\",\"top_notes\":[\"Pink Pepper, Cardamom, Violet Leaves\"],\"heart_notes\":[\"Sage, Melon, Cinnamon\"],\"base_notes\":[\"Vanilla, Chestnut, Amberwood\"],\"performance\":[\"Longevity: 8–12+ hours\",\"Projection: Strong (first 2–3 hours)\",\"Sillage: Noticeable and compliment-getting\",\"Best Season: Fall & Winter\",\"Occasion: Evening, Dates, Special Events\"],\"who_is_this_for\":[\"Men who love warm, sweet, masculine scents\",\"Fans of Stronger With You\",\"Anyone wanting a premium fragrance at an affordable price\"],\"product_details\":[\"Brand: Seveneven\",\"Size: 50ml\",\"Type: Extrait de Parfum\",\"Gender: Men\",\"Bottle: Premium glass with spray atomizer\"],\"shipping_returns\":[\"Fast shipping (3–7 business days)\",\"Secure checkout\",\"Easy returns policy\"],\"disclaimer\":\"This product is inspired. It is not affiliated with or endorsed by the original brand.\",\"cta_text\":\"Ready to Stand Out?\\nAdd Seveneven to your collection today and smell unforgettable.\"}',1,NULL),('7df982b0-12bb-45b9-938b-9b6eceb2e9a2','Fogg-impressio','hhqhhahah','8fcfe4fe-349a-11f1-98bb-b05cda347089',1,'2026-04-13 12:14:29','2026-04-22 12:25:42',NULL,'fogg-impressio',NULL,1,NULL),('960f12f1-0c5e-4c46-8aa1-2a8dc4745c08','Oud Noir','Oud-noir','86fc54d1-349a-11f1-98bb-b05cda347089',1,'2026-04-13 12:15:45','2026-04-22 12:25:34','988fd908-349a-11f1-98bb-b05cda347089','oud-noir',NULL,1,NULL),('ceb3be35-970c-490b-b22b-b32fdfdac1e0','Oud Noir','Best Thing you\'ve ever seen','8fcfe4fe-349a-11f1-98bb-b05cda347089',1,'2026-04-14 10:24:06','2026-04-22 12:25:24',NULL,'oud-noir',NULL,1,NULL),('cf3fbd6b-4770-45cf-b075-28dc5a3ce6de','Fogg-impressio','A very fragrant body mist ','86fc54d1-349a-11f1-98bb-b05cda347089',1,'2026-04-13 10:50:04','2026-04-13 10:50:15',NULL,'fogg-impressio',NULL,0,NULL),('f0d4b60b-eef9-4ee0-bc41-889394b9b60c','Fogg-impressio','A very much impressive fragrant perfume','8c1bf4ac-349a-11f1-98bb-b05cda347089',1,'2026-04-13 10:49:27','2026-04-13 10:49:27',NULL,'fogg-impressio',NULL,0,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(40) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('33ecc941-25cd-45ac-acf7-5bee85389ce2','Sahil Sahu',NULL,NULL,'sahilsahu1097@gmail.com','100147046336334719216','https://lh3.googleusercontent.com/a/ACg8ocKwFlVjlAwy97qMoj4pMHgioXqJwDcEMtUt03PeTRCAj6ylxA=s96-c',1,'2026-03-18 00:07:35','2026-03-18 00:07:35',NULL,NULL),('4f1e2d4b-e57f-422f-b7e7-6401f496f8c4','Sahil Sahu','Sahil','Sahu','sahil@gmail.com',NULL,NULL,1,'2026-04-17 11:30:47','2026-04-17 11:30:47','8887788778','$2b$10$.hXMfdaEav0G.pO9/l1HyOKfjkTqziw4abLdZhTnFVKgjpfLtKxga'),('9e967fe5-cee6-4c42-bcd3-8067358ac3f6','Prestigieux Media Tech',NULL,NULL,'info.prestigieux@gmail.com','102157911201141757452','https://lh3.googleusercontent.com/a/ACg8ocIaCDzbGcpfqEEQwHbr3hci4jQ4NcqNRa6A4mGOZwuRHTnrog=s96-c',1,'2026-04-03 15:03:48','2026-04-03 15:03:48',NULL,NULL),('e6455b61-872e-4cd7-b95e-ed6f26455e70','Nikhil Jaisinghani','Nikhil','Jaisinghani','nikhil@gmail.com',NULL,NULL,1,'2026-04-17 11:03:03','2026-04-17 11:03:03','8787878787','$2b$10$Nlqf6FWjUikDOGmHhQDGRObUAJ/Kt0WXslOrC4E.FHJGbi0r.6MkW');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 16:57:02
