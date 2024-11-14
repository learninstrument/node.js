-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2024 at 08:04 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `submission`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `studentName` varchar(255) DEFAULT NULL,
  `departmentName` varchar(255) DEFAULT NULL,
  `matricNumber` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `assignment` blob DEFAULT NULL,
  `seen` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `studentName`, `departmentName`, `matricNumber`, `level`, `assignment`, `seen`) VALUES
(31, 'bright', 'computer ', '344', '200', 0x75706c6f6164735c3564336636386330666538313335666232326562343265386261656564353533, 1),
(32, 'marian', 'computer science', '20918', '300', 0x75706c6f6164735c6635303134623731613361393034616361343232353335386262333833633432, 1),
(33, 'bright', 'computer ', '344', '300', 0x75706c6f6164735c3763666234663035663265326631343732373531383961313961336336306536, 1),
(34, 'bright', 'dd', '344', '200', 0x75706c6f6164735c3135643639366135313238343566376664653464316464626632353136303634, 1),
(35, 'bright', 'computer ', '99888', '200', 0x75706c6f6164735c3033653334633533613865313163636464393030646361623364636538653061, 1),
(36, 'emmunel', 'science', '2155', '400', 0x75706c6f6164735c3130313836633231616131393364333966663462623065303765386232646265, 1),
(37, 'bright', 'computer ', '344', '200', 0x75706c6f6164735c3633336337313362336135633834396432313533336262633562393630663731, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
