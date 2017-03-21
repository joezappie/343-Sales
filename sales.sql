-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u2
-- http://www.phpmyadmin.net
--
-- Host: vm343c.se.rit.edu
-- Generation Time: Mar 21, 2017 at 04:12 PM
-- Server version: 5.5.54
-- PHP Version: 5.4.45-0+deb7u3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sales`
--

-- --------------------------------------------------------

--
-- Table structure for table `Address`
--

CREATE TABLE IF NOT EXISTS `Address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(32) NOT NULL,
  `lastName` varchar(64) NOT NULL,
  `city` varchar(64) NOT NULL,
  `address` varchar(256) NOT NULL,
  `zip` int(11) NOT NULL,
  `stateId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stateId` (`stateId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `Customer`
--

CREATE TABLE IF NOT EXISTS `Customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(32) NOT NULL,
  `lastName` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(32) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `CustomerBusiness`
--

CREATE TABLE IF NOT EXISTS `CustomerBusiness` (
  `customerId` int(11) NOT NULL,
  `companyName` int(11) NOT NULL,
  UNIQUE KEY `customerId` (`customerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Item`
--

CREATE TABLE IF NOT EXISTS `Item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `serialNumber` varchar(32) NOT NULL,
  `modelId` int(11) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `status` enum('Original','Replacement','Refund') NOT NULL,
  `replacementDeadline` date NOT NULL,
  `refundDeadline` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `Order`
--

CREATE TABLE IF NOT EXISTS `Order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shippingAddressId` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `repId` int(11) DEFAULT NULL,
  `totalItemCost` decimal(10,2) NOT NULL,
  `shippingCost` decimal(10,2) NOT NULL,
  `orderDate` date NOT NULL,
  `isPaid` tinyint(1) NOT NULL,
  `taxPercentage` decimal(10,4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shippingAddressId` (`shippingAddressId`,`paymentId`,`customerId`),
  KEY `paymentId` (`paymentId`),
  KEY `customerId` (`customerId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `PaymentMethod`
--

CREATE TABLE IF NOT EXISTS `PaymentMethod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addressId` int(11) NOT NULL,
  `cardNumber` varchar(25) NOT NULL,
  `CVC` tinyint(4) NOT NULL,
  `expirationDate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addressId` (`addressId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ReturnPolicy`
--

CREATE TABLE IF NOT EXISTS `ReturnPolicy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL,
  `numberOfDays` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Table structure for table `ShippingCosts`
--

CREATE TABLE IF NOT EXISTS `ShippingCosts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Table structure for table `TaxRate`
--

CREATE TABLE IF NOT EXISTS `TaxRate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(32) NOT NULL,
  `rate` decimal(10,4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=51 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Address`
--
ALTER TABLE `Address`
  ADD CONSTRAINT `Address_ibfk_2` FOREIGN KEY (`stateId`) REFERENCES `TaxRate` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `CustomerBusiness`
--
ALTER TABLE `CustomerBusiness`
  ADD CONSTRAINT `CustomerBusiness_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Item`
--
ALTER TABLE `Item`
  ADD CONSTRAINT `Item_ibfk_2` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Order`
--
ALTER TABLE `Order`
  ADD CONSTRAINT `Order_ibfk_3` FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_ibfk_1` FOREIGN KEY (`shippingAddressId`) REFERENCES `Address` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_ibfk_2` FOREIGN KEY (`paymentId`) REFERENCES `PaymentMethod` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `PaymentMethod`
--
ALTER TABLE `PaymentMethod`
  ADD CONSTRAINT `PaymentMethod_ibfk_1` FOREIGN KEY (`addressId`) REFERENCES `Address` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
