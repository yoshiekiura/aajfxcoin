<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');
require_once(APPPATH.'libraries/PHPExcel/Classes/PHPExcel/IOFactory.php');
class IOFactory extends PHPExcel_IOFactory
{
 public function __construct()
 {
  parent::__construct();
 }
}
?>