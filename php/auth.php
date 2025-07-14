<?php
session_start();
if (empty($_SESSION["auth"])) {
    header("Location: login.php");
    exit;
}

