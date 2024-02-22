-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 22, 2024 at 11:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blogapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `blogid` varchar(255) NOT NULL,
  `sl_no` int(10) UNSIGNED NOT NULL,
  `uid` int(11) NOT NULL,
  `b_title` varchar(255) NOT NULL,
  `b_desc` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`blogid`, `sl_no`, `uid`, `b_title`, `b_desc`, `img`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('1e9c9b9e54369982', 5, 1, 'This is my third Blog', 'This is the description of the Blog', 'uploads\\1708579501926_star_reg.png', '2024-02-22 05:25:01', '2024-02-22 05:25:01', NULL),
('2ffa441332701d2d', 3, 2, 'This is my second BLOG', 'This is the description of the BLOG 2', NULL, '2024-02-21 06:02:37', '2024-02-21 06:02:37', '2024-02-21 11:16:46'),
('7688c61be3fa3871', 4, 1, 'This is my second Blog', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'uploads\\1708516463523_harryPotter.png', '2024-02-21 06:03:59', '2024-02-22 10:10:10', NULL),
('7708572d69372030', 1, 1, 'This is my first Blog', 'This is the description of the Blog', NULL, '2024-02-20 12:05:49', '2024-02-20 12:05:49', NULL),
('ae648da244dcebfe', 2, 2, 'This is my first BLOG', 'This is the description of the BLOG', NULL, '2024-02-21 06:02:10', '2024-02-21 06:02:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `user_name` varchar(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `user_name`, `name`, `email`, `passwd`, `role`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'biplab2001', 'Biplab Tarafder', 'biplab.tarafder@dcg.in', '$2b$12$Pqsa9VZE2muWwN3Zqy..Cea8dQawADDIiHgWwWKnZlvIBjLZrsew6', 'user', '2024-02-20 06:53:59', '2024-02-20 06:53:59', NULL),
(2, 'elonthechamp', 'Elon Musk', 'elon.musk@dcg.in', '$2b$12$YuvViF.LgKgyWhzoleZFIeKkf7au8i2G4KzggwOp6XmMOKXoaHAu6', 'user', '2024-02-21 05:50:01', '2024-02-21 05:50:01', NULL),
(3, 'admin01', 'Admin', 'admin@dcg.in', '$2b$12$WprY1sqkUSFo9YDOAbjs3.yQlWAz3pi3HawJ6rNQRtoTUSlCH5zcq', 'admin', '2024-02-22 09:26:56', '2024-02-22 09:26:56', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`blogid`),
  ADD UNIQUE KEY `sl_no` (`sl_no`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `sl_no` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
