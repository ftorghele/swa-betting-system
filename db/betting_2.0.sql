-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 04. Apr 2013 um 10:13
-- Server Version: 5.5.25
-- PHP-Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Datenbank: `betting_system`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bets`
--

CREATE TABLE `bets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_game` int(11) NOT NULL,
  `amount` double NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quote` double NOT NULL,
  `quoteA` tinyint(1) NOT NULL DEFAULT '0',
  `quoteB` tinyint(1) NOT NULL DEFAULT '0',
  `quoteX` tinyint(1) NOT NULL DEFAULT '0',
  `analyzed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `bets`
--

INSERT INTO `bets` (`id`, `id_user`, `id_game`, `amount`, `time`, `quote`, `quoteA`, `quoteB`, `quoteX`, `analyzed`) VALUES
(1, 2, 16, 10, '2013-04-04 07:46:46', 1.6, 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `quoteA` double DEFAULT NULL,
  `quoteB` double DEFAULT NULL,
  `quoteX` double DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `transmitted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Daten für Tabelle `games`
--

INSERT INTO `games` (`id`, `title`, `description`, `quoteA`, `quoteB`, `quoteX`, `endTime`, `transmitted`) VALUES
(16, 'Benfica Lissabon - Newcastle United', 'asdf', 1.5, 3, 4.33, '2013-04-04 21:05:00', 0),
(19, '1 gegen 2', 'test', 1.5, 6.2, 1.2, '2013-04-04 10:00:00', 1),
(20, 'Fallen Christoph die Haare aus?', 'asdf', 1.5, 6.2, 1.2, '2013-04-04 10:04:40', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fbId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `credits` double DEFAULT '1000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `fbId`, `name`, `credits`) VALUES
(1, 1137871804, 'Franz Torghele', 1000),
(2, 1194635551, 'Thomas Esterer', 1000);
