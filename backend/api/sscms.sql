-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 13, 2024 at 04:47 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sscms`
--

-- --------------------------------------------------------

--
-- Table structure for table `dispensed`
--

DROP TABLE IF EXISTS `dispensed`;
CREATE TABLE IF NOT EXISTS `dispensed` (
  `dispensed_id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` varchar(255) NOT NULL,
  `quantity` varchar(111) NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`dispensed_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dispensed`
--

INSERT INTO `dispensed` (`dispensed_id`, `inventory_id`, `quantity`, `created_at`) VALUES
(1, '20', '1', '2024-10-13'),
(2, '20', '5', '2024-10-13'),
(3, '19', '5', '2024-10-14'),
(4, '19', '5', '2024-10-14'),
(5, '19', '5', '2024-10-14');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `itemName` varchar(255) NOT NULL,
  `itemDescription` text NOT NULL,
  `quantity` int NOT NULL,
  `manufacturingDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `expiryDate` varchar(255) NOT NULL,
  `lotNo` varchar(255) NOT NULL,
  `associated_Illnesses` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`inventory_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `itemName`, `itemDescription`, `quantity`, `manufacturingDate`, `expiryDate`, `lotNo`, `associated_Illnesses`, `category`, `created_at`) VALUES
(20, 'MEFENAMIC', 'MEFENAMIC', 193, '2024-10-21', '2024-10-17', '31231', '2,5,4,16', 'medicine', '2024-10-07'),
(19, 'BIOGESIC', 'YOWWWWWWW', 985, '2024-10-15', '2024-10-24', '32131', '4,5,6', 'medicine', '2024-10-07'),
(14, 'WOW', 'WOW', 32131, '', '', '32131', '', 'medical-supply', '2024-10-07'),
(15, 'WOW', 'WOW', 32131, '', '', '32131', '', 'medical-supply', '2024-10-07'),
(16, 'WOW', 'WOW', 32131, '', '', '32131', '', 'medical-supply', '2024-10-07'),
(17, 'this should be n/a', 'this should be n/a', 32131, 'n/a', 'n/a', '3SDA', '', '', '2024-10-07'),
(21, 'TANG', 'TANG', 11111, '2024-10-29', '', '32331', '8,6,5', 'medicine', '2024-10-08');

-- --------------------------------------------------------

--
-- Table structure for table `medcert`
--

DROP TABLE IF EXISTS `medcert`;
CREATE TABLE IF NOT EXISTS `medcert` (
  `med_cert_id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `diagnosis` text NOT NULL,
  `ref_reason` text NOT NULL,
  `referenceClassification` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` date NOT NULL,
  `reffered` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`med_cert_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `medcert`
--

INSERT INTO `medcert` (`med_cert_id`, `studentId`, `studentName`, `gender`, `address`, `age`, `diagnosis`, `ref_reason`, `referenceClassification`, `date`, `reffered`) VALUES
(15, '2020-03488', 'Zeon D Perania', 'M', '1600 Fake Street', 15, 'diagnosis', 'referenc', 'risk level', '2024-10-10', 'ref to'),
(14, '2020-03488', 'Zeon D Perania', 'M', '1600 Fake Street', 15, 'diagnosis', 'referenc', 'risk level', '2024-10-10', 'ref to'),
(13, '2020-03488', 'Zeon D Perania', 'M', '1600 Fake Street', 15, 'diagnosis', 'referenc', 'risk level', '2024-10-10', 'ref to'),
(12, '2020-03488', 'Zeon D Perania', 'M', '1600 Fake Street', 15, 'diagnosis', 'referenc', 'risk level', '2024-10-10', 'ref to'),
(11, '2020-03488', 'Zeon D Perania', 'M', '1600 Fake Street', 15, 'diagnosis', 'referenc', 'risk level', '2024-10-10', 'ref to'),
(16, '2019-00939', 'Jocelyn P Gomeri', 'M', '1600 Fake Street', 2312, 'dian', 'dian', 'dian', '2024-10-15', 'dian');

-- --------------------------------------------------------

--
-- Table structure for table `medreport`
--

DROP TABLE IF EXISTS `medreport`;
CREATE TABLE IF NOT EXISTS `medreport` (
  `med_rep_id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remarks` text NOT NULL,
  `recom` text NOT NULL,
  `date` date NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `course` varchar(255) NOT NULL,
  PRIMARY KEY (`med_rep_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `medreport`
--

INSERT INTO `medreport` (`med_rep_id`, `studentId`, `remarks`, `recom`, `date`, `studentName`, `year`, `course`) VALUES
(1, 'S12345sssssss', 'remarksssssssss', 'recommendationsnnnnnnnnnn', '2024-10-25', 'BEN BENsssssssss', '3sssssssss', 'BSCEssssssss'),
(2, '2020-04263', 'remarks', 'recome', '2023-10-24', 'Michelle R Gabito', '3', 'BSCE'),
(11, '2020-02857', 's', 's', '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE'),
(10, '2020-02857', 's', 's', '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE'),
(8, '2020-02857', 's', 's', '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE'),
(9, '2020-02857', 's', 's', '2024-10-14', 'Narshelyn O Aviso', '4', 'BSCE'),
(12, '2020-02857', 's', 's', '2024-10-16', 'Narshelyn O Aviso', '4', 'BSCE'),
(13, '2020-02857', 's', 's', '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE'),
(14, '2020-02857', 's', 's', '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE'),
(15, '2020-02857', 's', 's', '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE');

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
CREATE TABLE IF NOT EXISTS `prescription` (
  `prescription_id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `illness` varchar(255) NOT NULL,
  `prescrip` varchar(255) NOT NULL,
  `sig` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `date` date NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `course` varchar(255) NOT NULL,
  PRIMARY KEY (`prescription_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prescription`
--

INSERT INTO `prescription` (`prescription_id`, `studentId`, `illness`, `prescrip`, `sig`, `quantity`, `date`, `studentName`, `year`, `course`) VALUES
(1, 'S12345', 'allergy', 'MEFENAMIC', 'SIG', 500, '2024-10-09', 'BEN', 'BEN', ''),
(2, 'S12345', 'sakit sulok sulok', '', 'SIG', 500, '2024-10-09', 'YOWWW', 'YOWWW', ''),
(3, 'S12345', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-09', 'YOWWW', 'YOWWW', ''),
(4, '2020-03488', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-09', '', '2', 'BSA-ANSCI'),
(5, '2021-03303', 'antibiotic', 'TANG', 'SIG', 500, '2024-10-10', 'Aubrey Blanca P Caballero', '4', 'BSED-ENGLISH'),
(6, '2021-03303', 'antibiotic', 'TANG', 'SIG', 500, '2024-10-10', 'Aubrey Blanca P Caballero', '4', 'BSED-ENGLISH'),
(7, '2021-03303', 'antibiotic', 'TANG', 'SIG', 500, '2024-10-10', 'Aubrey Blanca P Caballero', '4', 'BSED-ENGLISH'),
(8, '2021-03303', 'antibiotic', 'TANG', 'SIG', 500, '2024-10-10', 'Aubrey Blanca P Caballero', '4', 'BSED-ENGLISH'),
(9, '2019-00939', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-14', 'Jocelyn P Gomeri', '4', 'BSED-ENGLISH'),
(10, '2022-00035', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-15', 'Klein Morgan M Villasor', '3', 'BSBA-MM'),
(11, '2019-00939', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-15', 'Jocelyn P Gomeri', '4', 'BSED-ENGLISH'),
(12, '2019-00939', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-15', 'Jocelyn P Gomeri', '4', 'BSED-ENGLISH'),
(13, '2019-00939', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-15', 'Jocelyn P Gomeri', '4', 'BSED-ENGLISH'),
(14, '2020-03488', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-15', 'Zeon D Perania', '2', 'BSA-ANSCI'),
(15, '2020-03488', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 500, '2024-10-15', 'Zeon D Perania', '2', 'BSA-ANSCI'),
(16, '2020-02857', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 3, '2024-10-15', 'Narshelyn O Aviso', '4', 'BSCE'),
(17, '2020-02857', 'sakit sulok sulok', 'MEFENAMIC', 'SIG', 3, '2024-10-13', 'Narshelyn O Aviso', '4', 'BSCE'),
(18, '2020-04263', 'allergy', 'MEFENAMIC', 'SIG', 1, '2024-10-15', 'Michelle R Gabito', '3', 'BSCE'),
(19, '2020-04263', 'allergy', 'MEFENAMIC', 'SIG', 1, '2024-10-15', 'Michelle R Gabito', '3', 'BSCE'),
(20, '2020-04263', 'allergy', 'MEFENAMIC', 'SIG', 5, '2024-10-15', 'Michelle R Gabito', '3', 'BSCE'),
(21, '2021-02329', 'allergy', 'BIOGESIC', 'SIG', 5, '2024-10-22', 'Ruel N Tomayao', '4', 'BSED-ENGLISH'),
(22, '2021-02329', 'allergy', 'BIOGESIC', 'SIG', 5, '2024-10-22', 'Ruel N Tomayao', '4', 'BSED-ENGLISH'),
(23, '2021-02329', 'allergy', 'BIOGESIC', 'SIG', 5, '2024-10-22', 'Ruel N Tomayao', '4', 'BSED-ENGLISH');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
CREATE TABLE IF NOT EXISTS `volunteer` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `year` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`volunteer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`volunteer_id`, `student_name`, `course`, `year`, `email`, `student_id`, `phone_number`, `created_at`, `password`) VALUES
(1, 'namesda d', 'yttear d', '', 'dsad@gmail.com d', 'student ids', 'phone d', '2024-10-08', ''),
(8, 'stud', 'co', '', 'reyde@gmail.com', 'okayy', 'ph', '2024-10-08', ''),
(9, 'Narshelyn O Aviso', 'BSCE', '4', 'reydel@gmail.com', '2020-02857', 'phone', '2024-10-10', 'C1xFmLEO');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
