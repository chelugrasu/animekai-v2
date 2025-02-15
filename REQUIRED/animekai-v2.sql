-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2025 at 03:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `animekai-v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `continuewatching`
--

CREATE TABLE `continuewatching` (
  `id` int(11) NOT NULL,
  `episode_id` int(11) NOT NULL,
  `video_thumbnail` text NOT NULL,
  `episode_title` text NOT NULL,
  `series_slug` text NOT NULL,
  `user_name` text NOT NULL,
  `continue_time` int(11) NOT NULL,
  `episode_length` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `episodes`
--

CREATE TABLE `episodes` (
  `episode_id` int(11) NOT NULL,
  `episode_title` text NOT NULL,
  `episode_description` text NOT NULL,
  `video_url` text NOT NULL,
  `video_thumbnail` text NOT NULL DEFAULT 'https://cdn.discordapp.com/attachments/1217171998837571644/1218290207326081125/photoInexistent-headerPhoto.jpg?ex=6607202c&is=65f4ab2c&hm=0e17bb351d978c56508b4d87ed10a5cea5fb047a7a5df65014eeaac7947b738b&',
  `series_slug` text NOT NULL,
  `episode_season` text NOT NULL,
  `intro` text NOT NULL,
  `outro` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `episodes`
--

INSERT INTO `episodes` (`episode_id`, `episode_title`, `episode_description`, `video_url`, `video_thumbnail`, `series_slug`, `episode_season`, `intro`, `outro`, `created_date`) VALUES
(1, '01: M-am obișnuit cu asta', 'TBA.', 'https://streamtape.com/v/7bxJJARW6VUY8G', 'https://thumb.tapecontent.net/thumb/7bxJJARW6VUY8G/jp8OmzGwq3fzkaM.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:16:25'),
(2, '02: Dacă aș mai avea o șansă', 'TBA.', 'https://streamtape.com/v/xZLjeDe6mZCkk4p', 'https://thumb.tapecontent.net/thumb/xZLjeDe6mZCkk4p/Zbzb9VYqRMsBYR.jpg', 'solo-leveling', 'Solo-Leveling-S1', '{\"start\": \"00:02:10\", \"end\": \"00:03:40\"}', '{\"start\": \"00:22:05\", \"end\": \"00:23:37\"}', '2024-02-22 23:16:25'),
(3, '03: E ca un joc', 'TBA.', 'https://streamtape.com/v/Zzz9jDyAlBcqXjB', 'https://thumb.tapecontent.net/thumb/Zzz9jDyAlBcqXjB/qxrB80xp4dtZpG.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:18:48'),
(4, '04: Trebuie să devin mai puternic', 'TBA.', 'https://streamtape.com/v/7BvdGP6GrPIxDX', 'https://thumb.tapecontent.net/thumb/7BvdGP6GrPIxDX/6PMQeWZz3ZI9AR2.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:18:48'),
(5, '05: O afacere destul de bună', 'TBA.', 'https://streamtape.com/v/zLq3A3oGp7tgY9', 'https://thumb.tapecontent.net/thumb/zLq3A3oGp7tgY9/4AWWbpLqqOTKD1L.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:20:59'),
(6, '06: Vânătoarea adevărată începe acum', 'TBA.', 'https://streamtape.com/v/61Qwy1xYyKtv03', 'https://thumb.tapecontent.net/thumb/61Qwy1xYyKtv03/rJ4JbyxOGvUb2Ka.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:20:59'),
(7, '07: Să vedem cât de departe pot ajunge', 'TBA.', 'https://streamtape.com/v/4z281JMryzsKarL', 'https://thumb.tapecontent.net/thumb/4z281JMryzsKarL/YpoOxJGzBpcvQKb.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:20:59'),
(8, '08: Asta e frustrant', 'TBA.', 'https://streamtape.com/v/7Ywpaekby4hAg0l/%5BASW%5D_Solo_Leveling_-_08_%5B1080p_HEVC%5D%5BA048CD63%5D.mkv.mp4', 'https://thumb.tapecontent.net/thumb/7Ywpaekby4hAg0l/eV4Rje2lJrIYBpR.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:20:59'),
(9, '09: Îți ascundeai abilitățile', 'TBA.', 'https://streamtape.com/v/V0G272eAdqCKwZL/%5BASW%5D_Solo_Leveling_-_09_%5B1080p_HEVC%5D%5B86EE2B81%5D.mkv.mp4', 'https://thumb.tapecontent.net/thumb/V0G272eAdqCKwZL/VopgL2AKGohKMmd.jpg', 'solo-leveling', 'Solo-Leveling-S1', '', '', '2024-02-22 23:20:59'),
(10, '09: Să vedem cât de departe pot ajunge', 'TBA.', '<div style=\"position: relative; padding-top: 56.25%;\"><iframe src=\"https://iframe.mediadelivery.net/embed/192205/cbc81e16-5810-495d-9a21-e7840c458815?autoplay=true\" loading=\"lazy\" style=\"border: none; position: absolute; top: 0; height: 100%; width: 100%;\" allow=\"accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;\" allowfullscreen=\"true\"></iframe></div>', 'https://cdn.discordapp.com/attachments/1217171998837571644/1218290207326081125/photoInexistent-headerPhoto.jpg?ex=6607202c&is=65f4ab2c&hm=0e17bb351d978c56508b4d87ed10a5cea5fb047a7a5df65014eeaac7947b738b&', 'solo-leveling', 'Solo-Leveling-S2', '', '', '2024-02-22 23:20:59'),
(11, '10: Să vedem cât de departe pot ajunge', 'TBA.', '<div style=\"position: relative; padding-top: 56.25%;\"><iframe src=\"https://iframe.mediadelivery.net/embed/192205/cbc81e16-5810-495d-9a21-e7840c458815?autoplay=true\" loading=\"lazy\" style=\"border: none; position: absolute; top: 0; height: 100%; width: 100%;\" allow=\"accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;\" allowfullscreen=\"true\"></iframe></div>', 'https://cdn.discordapp.com/attachments/1217171998837571644/1218290207326081125/photoInexistent-headerPhoto.jpg?ex=6607202c&is=65f4ab2c&hm=0e17bb351d978c56508b4d87ed10a5cea5fb047a7a5df65014eeaac7947b738b&', 'solo-leveling', 'Solo-Leveling-S2', '', '', '2024-02-22 23:20:59'),
(12, '01: O tragedie', 'TBA.', 'https://streamtape.com/v/7bxJJARW6VUY8G/%5BASW%5D_Solo_Leveling_-_01_%5B1080p_HEVC%5D%5B1F045686%5D.mkv', 'https://cdn.discordapp.com/attachments/1217171998837571644/1218290207326081125/photoInexistent-headerPhoto.jpg?ex=6607202c&is=65f4ab2c&hm=0e17bb351d978c56508b4d87ed10a5cea5fb047a7a5df65014eeaac7947b738b&', 'tokyo-ghoul', 'Tokyo-Ghoul-S1', '', '', '2024-02-28 18:38:03'),
(13, '02: O fut pe ma-sa', 'TBA.', 'https://streamtape.com/v/xZLjeDe6mZCkk4p/%5BASW%5D_Solo_Leveling_-_02_%5B1080p_HEVC%5D%5B80EA6E19%5D.mkv', 'https://cdn.discordapp.com/attachments/1217171998837571644/1218290207326081125/photoInexistent-headerPhoto.jpg?ex=6607202c&is=65f4ab2c&hm=0e17bb351d978c56508b4d87ed10a5cea5fb047a7a5df65014eeaac7947b738b&', 'tokyo-ghoul', 'Tokyo-Ghoul-S1', '', '', '2024-02-28 18:38:03');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `reviewed_series_slug` text NOT NULL,
  `reviewer_name` text NOT NULL,
  `review_rating` int(11) NOT NULL DEFAULT 0,
  `review_description` text NOT NULL,
  `review_spoiler` tinyint(1) NOT NULL DEFAULT 0,
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  `review_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `post_id` int(11) NOT NULL,
  `url_slug` text NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `genre` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`genre`)),
  `rating` int(11) NOT NULL,
  `involved_team` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`involved_team`)),
  `header_photo` text NOT NULL,
  `poster_photo` text NOT NULL,
  `release_date` text NOT NULL,
  `seasons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seasons`)),
  `publish_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `series`
--

INSERT INTO `series` (`post_id`, `url_slug`, `title`, `description`, `genre`, `rating`, `involved_team`, `header_photo`, `poster_photo`, `release_date`, `seasons`, `publish_date`) VALUES
(1, 'solo-leveling', 'Solo Leveling', 'Ten years ago, \"the Gate\" appeared and connected the real world with the realm of magic and monsters. To combat these vile beasts, ordinary people received superhuman powers and became known as \"Hunters.\" Twenty-year-old Sung Jin-Woo is one such Hunter, but he is known as the \"World\'s Weakest,\" owing to his pathetic power compared to even a measly E-Rank. Still, he hunts monsters tirelessly in low-rank Gates to pay for his mother\'s medical bills.', '[\"Acțiune\", \"Aventură\", \"Fantezie\"]', 5, '[\"CheluAkaGrasu\", \"Bluepowder\"]', 'solo-leveling-headerPhoto', 'solo-leveling-posterPhoto', '06/01/2024', '{\"Sezonul 1\":\"Solo-Leveling-S1\", \"Sezonul 2\":\"Solo-Leveling-S2\"}', '2024-02-18 15:17:30'),
(2, 'tokyo-ghoul', 'Tokyo Ghoul', 'A sinister threat is invading Tokyo: flesh-eating \"ghouls\" who appear identical to humans and blend into their population. Reserved college student Ken Kaneki buries his nose in books and avoids the news of the growing crisis. However, the appearance of an attractive woman named Rize Kamishiro shatters his solitude when she forwardly asks him on a date.', '[\"Acțiune\", \"Fantezie\", \"Horror\"]', 0, '[\"Bluepowder\", \"CheluAkaGrasu\",\"MihaiPrintu\"]', 'tokyo-ghoul-headerPhoto', 'tokyo-ghoul-posterPhoto', '12/04/2012', '{\"Sezonul 1\":\"Tokyo-Ghoul-S1\",\"Sezonul 2\":\"Tokyo-Ghoul-S2\",\"S3\":\"Tokyo-Ghoul-S3\"}', '2024-02-18 11:17:37'),
(3, 'one-piece', 'One Piece', 'Barely surviving in a barrel after passing through a terrible whirlpool at sea, carefree Monkey D. Luffy ends up aboard a ship under attack by fearsome pirates. Despite being a naive-looking teenager, he is not to be underestimated. Unmatched in battle, Luffy is a pirate himself who resolutely pursues the coveted One Piece treasure and the King of the Pirates title that comes with it.', '[\"Acțiune\", \"Aventură\", \"Fentezie\"]', 0, '[\"CheluAkaGrasu\", \"BluePowder\"]', 'One-Piece-headerPhoto', 'One-Piece-posterPhoto', '20 October 1999', '{\"S1\":\"One-Piece-S1\",\"S2\":\"One-Piece-S2\",\"S3\":\"One-Piece-S3\"}', '2024-02-18 12:45:53'),
(4, 'devilman-crybaby', 'Devilman: Crybaby', 'Devils cannot take form without a living host. However, if the will of an individual is strong enough, they can overcome the demon and make its power their own, becoming a Devilman.', '[\"Horror\", \"Sci-Fi\", \"Acțiune\"]', 0, '[\"Bluepowder\", \"CheluAkaGrasu\",\"MihaiPrintu\"]', 'devilman-crybaby-headerPhoto', 'Devilman-Crybaby-posterPhoto', '5 January 2018', '{\"S1\":\"Devilman:Crybaby-S1\",\"S2\":\"Devilman:Crybaby-S2\"}', '2024-02-18 12:45:59'),
(5, 'sword-art-online', 'Sword Art Online', 'Ever since the release of the innovative NerveGear, gamers from all around the globe have been given the opportunity to experience a completely immersive virtual reality. Sword Art Online (SAO), one of the most recent games on the console, offers a gateway into the wondrous world of Aincrad, a vivid, medieval landscape where users can do anything within the limits of imagination. With the release of this worldwide sensation, gaming has never felt more lifelike.', '[\"Acțiune\", \"Aventură\", \"Fantezie\"]', 0, '[\"CheluAkaGrasu\"]', 'sword-art-online-headerPhoto', 'sword-art-online-posterPhoto', '8 Iulie 2012', '{\"S1\":\"Sword-Art-Online-S1\",\"S2\":\"Sword-Art-Online-S2\",\"S3\":\"Sword-Art-Online-S3\",\"S4\":\"Sword-Art-Online-S4\",\"S5\":\"Sword-Art-Online-S5\"}', '2024-02-18 15:17:30'),
(18, 'attack-on-titan', 'Attack on Titan', 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal Titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.', '[\"Acțiune\", \"Dramă\", \"Suspans\"]', 0, '[\"CheluAkaGrasu\"]', 'attack-on-titan-headerPhoto', 'attack-on-titan-posterPhoto', '7 Aprilie 2013', '{\"S1\":\"Attack-On-Titan-S1\",\"S2\":\"Attack-On-Titan-S2\",\"S3\":\"Attack-On-Titan-S3\",\"S4\":\"Attack-On-Titan-S4\"}', '2024-02-18 15:17:31'),
(19, 'demon-slayer', 'Demon Slayer', 'Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado\'s shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night.', '[\"Acțiune\", \"Fantezie\", \"Aventură\"]', 0, '[\"CheluAkaGrasu\"]', 'demon-slayer-headerPhoto', 'demon-slayer-posterPhoto', '6 Aprilie 2019', '{\"S1\":\"Demon-Slayer-S1\",\"S2\":\"Demon-Slayer-S2\",\"S3\":\"Demon-Slayer-S3\"}', '2024-02-18 15:17:32'),
(20, 'jujutsu-kaisen', 'Jujutsu Kaisen', 'Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital, where he visits his bedridden grandfather. However, this leisurely lifestyle soon takes a turn for the strange when he unknowingly encounters a cursed item. Triggering a chain of supernatural occurrences, Yuuji finds himself suddenly thrust into the world of Curses—dreadful beings formed from human malice and negativity—after swallowing the said item, revealed to be a finger belonging to the demon Sukuna Ryoumen, the King of Curses.', '[\"Acțiune\", \"Fantezie\"]', 0, '[\"CheluAkaGrasu\"]', 'jujutsu-kaisen-headerPhoto', 'jujutsu-kaisen-posterPhoto', '3 Octombrie 2020', '{\"S1\":\"Jujutsu-Kaisen-S1\",\"S2\":\"Jujutsu-Kaisen-S2\"}', '2024-02-18 15:19:30'),
(21, 'spy-x-family', 'Spy x Family', 'Corrupt politicians, frenzied nationalists, and other warmongering forces constantly jeopardize the thin veneer of peace between neighboring countries Ostania and Westalis. In spite of their plots, renowned spy and master of disguise \"Twilight\" fulfills dangerous missions one after another in the hope that no child will have to experience the horrors of war.', '[\"Acțiune\", \"Comedie\"]', 0, '[\"CheluAkaGrasu\"]', 'spy-x-family-headerPhoto', 'spy-x-family-posterPhoto', '9 Aprilie 2022', '{\"S1\":\"Spy-x-Family-S1\",\"S2\":\"Spy-x-Family-S2\"}', '2024-02-18 15:21:30'),
(22, 'vinland-saga', 'Vinland Saga', 'Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland. It\'s said to be warm and fertile, a place where there would be no need for fighting—not at all like the frozen village in Iceland where he was born, and certainly not like his current life as a mercenary. War is his home now. Though his father once told him, \"You have no enemies, nobody does. There is nobody who it\'s okay to hurt,\" as he grew, Thorfinn knew that nothing was further from the truth.', '[\"Acțiune\", \"Aventură\", \"Dramă\"]', 0, '[\"CheluAkaGrasu\"]', 'vinland-saga-headerPhoto', 'vinland-saga-posterPhoto', '9 Aprilie 2019', '{\"S1\":\"Vinland-Saga-S1\",\"S2\":\"Vinland-Saga-S2\"}', '2024-02-18 15:23:30'),
(23, 'code-geass', 'Code Geass', 'Lelouch Lamperouge, a Britannian student, unfortunately finds himself caught in a crossfire between the Britannian and the Area 11 rebel armed forces. He is able to escape, however, thanks to the timely appearance of a mysterious girl named C.C., who bestows upon him Geass, the \"Power of Kings.\" Realizing the vast potential of his newfound \"power of absolute obedience,\" Lelouch embarks upon a perilous journey as the masked vigilante known as Zero, leading a merciless onslaught against Britannia in order to get revenge once and for all.', '[\"Acțiune\", \"Dramă\", \"Fantezie\"]', 0, '[\"CheluAkaGasu\", \"mitsurichanuwu\"]', 'code-geass-headerPhoto', 'code-geass-posterPhoto', '6 Octombrie 2006', '{\"S1\":\"Code-Geass-S1\",\"S2\":\"Code-Geass-S2\"}', '2024-02-20 22:24:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `adminAcces` int(11) NOT NULL DEFAULT 0,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password` longtext NOT NULL,
  `profile_picture` text NOT NULL,
  `verified` text NOT NULL DEFAULT 'false',
  `verify_token` text NOT NULL,
  `forgot_token` text NOT NULL,
  `new_email_address` text NOT NULL,
  `new_email_token` text NOT NULL,
  `new_email_status` text NOT NULL DEFAULT 'false',
  `viewed_series` text NOT NULL,
  `towatch_series` text NOT NULL,
  `profile_settings` text NOT NULL DEFAULT '[{"watchedSeries": true, "reviews": true, "toWatch": true}]',
  `about_me` text NOT NULL DEFAULT 'Fără biografie.',
  `created_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `continuewatching`
--
ALTER TABLE `continuewatching`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `episodes`
--
ALTER TABLE `episodes`
  ADD PRIMARY KEY (`episode_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD UNIQUE KEY `post_id` (`post_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `username` (`username`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `continuewatching`
--
ALTER TABLE `continuewatching`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `episodes`
--
ALTER TABLE `episodes`
  MODIFY `episode_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `series`
--
ALTER TABLE `series`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
