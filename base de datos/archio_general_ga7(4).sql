-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-03-2026 a las 18:16:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `archio_general_ga7`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dependencias`
--

CREATE TABLE `dependencias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dependencias`
--

INSERT INTO `dependencias` (`id`, `nombre`) VALUES
(1, 'Talento Humano'),
(2, 'Inteligencia'),
(3, 'Operaciones'),
(4, 'Logística');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `archivo` varchar(255) NOT NULL,
  `fecha_documento` date NOT NULL,
  `tipo_documento_id` int(11) NOT NULL,
  `dependencia_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id`, `titulo`, `archivo`, `fecha_documento`, `tipo_documento_id`, `dependencia_id`, `usuario_id`, `fecha_subida`) VALUES
(13, 'ORDEN GENERAL 216', 'uploads/talento_humano/1769441380567-216_VIERNES_01NOV_----signed.pdf', '2024-11-01', 2, 1, 1, '2026-01-26 15:29:40'),
(14, 'ORDEN GENERAL 217', 'uploads/talento_humano/1769441433397-217_lunes_04nov24-signed.pdf', '2024-11-04', 2, 1, 1, '2026-01-26 15:30:33'),
(17, 'rancho noviembre', 'uploads/talento_humano/1769540829310-8._RANCHO_NOVIEMBRE_CORREGIDA_-_copia.xlsx', '2024-11-30', 1, 1, 3, '2026-01-27 19:07:09'),
(19, 'PTT Guaman Jhonatan', 'uploads/talento_humano/1770074650274-IMG_20260128_094443_010.jpg', '2024-12-28', 5, 1, 3, '2026-02-02 23:24:11'),
(20, 'PTT Soto Bryan', 'uploads/talento_humano/1770074720961-IMG_20260128_094437_664.jpg', '2024-01-28', 5, 1, 3, '2026-02-02 23:25:22'),
(21, 'orden fragmentario 09 OCTUBRE', 'uploads/operaciones/1770078624225-09_ORDEN_FRAGMENTARIA_DEFENSA_DEL_TERRITORIO_GA7_2024-1602_OCTUBRE.pdf', '2024-10-04', 9, 3, 1, '2026-02-03 00:30:24'),
(22, '10. ORDEN FRAGMENTARIA AMBITO INTERNO OCTUBRE', 'uploads/operaciones/1770078745075-09._ORDEN_FRAGMENTARIA_AMBITO_INTERNO_GA7_CABO_MINACHO_2024-1601_OCTUBRE.pdf', '2024-10-04', 9, 3, 1, '2026-02-03 00:32:25'),
(23, 'ORDEN FRAGMENTARIA DEFENSA DEL TERRITORIO GA7 2024-1603 NOVIEMBRE', 'uploads/operaciones/1770079124575-09_ORDEN_FRAGMENTARIA_DEFENSA_DEL_TERRITORIO_GA7_2024-1603_NOVIEMBRE.docx', '2024-11-08', 9, 3, 1, '2026-02-03 00:38:44'),
(24, '09. ORDEN FRAGMENTARIA AMBITO INTERNO GA7 CABO MINACHO 2024-1601 NOVIEMBRE', 'uploads/operaciones/1770079186823-09._ORDEN_FRAGMENTARIA_AMBITO_INTERNO_GA7_CABO_MINACHO_2024-1601_NOVIEMBRE.docx', '2024-11-08', 9, 3, 1, '2026-02-03 00:39:46'),
(25, 'orden_fragmentaria_2024-208 julio', 'uploads/operaciones/1770079399782-orden_fragmentaria_2024-208_1_.pdf', '2024-06-06', 9, 3, 1, '2026-02-03 00:43:19'),
(26, 'OFICIO A PPNN', 'uploads/operaciones/1770079679786-OFICIO_A_PPNN.docx', '2024-12-03', 1, 3, 1, '2026-02-03 00:47:59'),
(27, '1.1  INFORME DE CONFORMIDAD 15000KM', 'uploads/logistica/1770079899518-1.1__INFORME_DE_CONFORMIDAD_15000KM.pdf', '2024-09-06', 4, 4, 1, '2026-02-03 00:51:39'),
(28, 'ACTA DE ENTREGA DE VEHICULO 3.5 XEI-1926', 'uploads/logistica/1770080095594-ACTA_VEHICULO_3.5_XEI-1926.docx', '2024-08-08', 13, 4, 1, '2026-02-03 00:54:55'),
(29, 'INFORME VALORIZACION DE POLVORIN DEL GA7', 'uploads/logistica/1770080234022-INFORME_VALORIZACION_DE_POLVORIN_DEL_GA7.docx', '2024-02-15', 4, 4, 1, '2026-02-03 00:57:14'),
(30, 'informe de entrega recepcion comandante', 'uploads/logistica/1770080308005-informe_de_entrega_recepcion_comandante.docx', '2024-08-07', 4, 4, 1, '2026-02-03 00:58:28'),
(33, 'Escuesta de Rancho del Mes de Dieciembre', 'uploads/talento_humano/1771537021595-ENCUESTA_RANCHO_MES_DE_DICIEMBRE.pdf', '2024-12-31', 3, 1, 1, '2026-02-19 21:37:01'),
(34, 'Escuesta de Rancho del Mes de Noviembre', 'uploads/talento_humano/1771537061173-ENCUESTA_RANCHO_MES_DE_NOVIEMBRE.pdf', '2024-11-30', 3, 1, 1, '2026-02-19 21:37:41'),
(35, 'Escuesta de Rancho del Mes de Octubre', 'uploads/talento_humano/1771537100423-ENCUESTA_RANCHO_MES_DE_OCTUBRE_-_copia.pdf', '2024-10-31', 3, 1, 1, '2026-02-19 21:38:20'),
(36, 'Escuesta de Rancho del Mes de Septiembre', 'uploads/talento_humano/1771537135130-ENCUESTA_RANCHO_MES_DE_SEPTIEMBRE.pdf', '2024-09-30', 3, 1, 1, '2026-02-19 21:38:55'),
(37, 'Boletin Informativo', 'uploads/inteligencia/1771537685699-01_FT-7BI-IM-2024-0020-M__1_.pdf', '2024-09-05', 4, 2, 1, '2026-02-19 21:48:05'),
(38, 'Informacion de los mas buscados', 'uploads/inteligencia/1771537864094-Cabecillas.docx', '2024-12-16', 8, 2, 1, '2026-02-19 21:51:04'),
(39, 'Informe de Justificacion', 'uploads/inteligencia/1771537956921-04_informe_de_justificacion_CPL.docx', '2024-10-07', 7, 2, 1, '2026-02-19 21:52:36'),
(40, 'Informe COMIN', 'uploads/inteligencia/1771538073400-01_Informe_COMIN_28AGO24.pdf', '2024-10-17', 4, 2, 1, '2026-02-19 21:54:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_documento`
--

CREATE TABLE `tipos_documento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `dependencia_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_documento`
--

INSERT INTO `tipos_documento` (`id`, `nombre`, `dependencia_id`) VALUES
(1, 'Confronta del rancho', 1),
(2, 'Orden general', 1),
(3, 'Encuesta clima laboral', 1),
(4, 'Informe', 1),
(5, 'Salvoconducto', 1),
(6, 'Anexo de Inteligencia', 2),
(7, 'Informe Periódico de Inteligencia', 2),
(8, 'Orden de Búsqueda', 2),
(9, 'Orden de Operaciones', 3),
(10, 'Calco de Operaciones', 3),
(11, 'Cuadro de Seguimiento', 3),
(12, 'Pedido de Material', 4),
(13, 'Acta de Entrega ', 4),
(14, 'Inventario de Almacén', 4),
(15, 'Mantenimiento Vehicular', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','dependencia') NOT NULL,
  `dependencia_id` int(11) DEFAULT NULL,
  `force_password_change` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `usuario`, `password`, `rol`, `dependencia_id`, `force_password_change`) VALUES
(1, 'Administrador General', 'Admin', '$2b$12$YH5munsC1rWmuy6lufg57.0uKe3pwAUnrEV0DO9BMJR1JxprAfrh.', 'admin', 1, 0),
(2, 'Logística', 'logistica', '$2b$12$peNPLI37QFAUSQq6D80p.OcTaBjC.OM4xMtJ/v.5DWcEv4LnwkpMO', 'dependencia', 4, 0),
(3, 'Talento Humano', 'talento', '$2b$12$ltnLB1fjHYqfBgl1eLlg9uGr2xcwDqAwPmjiKtfvii2IaWJu2COZK', 'dependencia', 1, 0),
(4, 'Inteligencia', 'inteligencia', 'intel123', 'dependencia', 2, 0),
(5, 'Operaciones', 'operaciones', '$2b$12$ogB7NUNr6EOhruXDVKySY.6DH4dtgmg2cclXflG.3qL8nMaZUsJmG', 'dependencia', 3, 0),
(6, 'TecnicoInformatico', 'superadmin', '$2b$12$9KkgIOkoOJ47nvconvMoNO4nGfP9QIHmo4/JM5zuPvSvBCaMwh2q.', 'admin', 1, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dependencias`
--
ALTER TABLE `dependencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_documentos_tipo` (`tipo_documento_id`),
  ADD KEY `fk_documentos_dependencia` (`dependencia_id`),
  ADD KEY `fk_documentos_usuario` (`usuario_id`);

--
-- Indices de la tabla `tipos_documento`
--
ALTER TABLE `tipos_documento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `dependencia_id` (`dependencia_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dependencias`
--
ALTER TABLE `dependencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `tipos_documento`
--
ALTER TABLE `tipos_documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `fk_documentos_dependencia` FOREIGN KEY (`dependencia_id`) REFERENCES `dependencias` (`id`),
  ADD CONSTRAINT `fk_documentos_tipo` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipos_documento` (`id`),
  ADD CONSTRAINT `fk_documentos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`dependencia_id`) REFERENCES `dependencias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
