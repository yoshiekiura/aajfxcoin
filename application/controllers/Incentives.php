<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Incentives extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function __construct() 
	{
        parent::__construct();
        $this->load->model('Incentives_model');
   		$this->menu_active = 'payment_details';
    }

	public function index()
	{
		$session_data = $this->session->userdata;
		$data = array();
		$data['session_data'] = $session_data;
		$this->load->view('template/incentives',$data);
	}

	public function referral_income()
	{
		$session_data = $this->session->userdata;
		$data = array();
		$data['session_data'] = $session_data;
		$this->load->view('template/referral_income',$data);
	}

	public function get_bonus()
	{
		$session_data = $this->session->userdata;
		$userid = $session_data['logged_in']['userid'];
		$total =  getBonus($userid,false);
	}


	public function sell_referral_coins()
	{
		if($this->input->post())
		{
			$status = '';
			$message = '';
			$session_data = $this->session->userdata;
			$userid = $session_data['logged_in']['userid'];
			$created_date = config_item('current_date');
		
			$coins = $this->input->post('coins');
			$payment_details = $this->input->post('payment_details');
			$payment_type = $this->input->post('payment_type');
			
			$this->load->library('form_validation');
			$this->form_validation->set_rules('coins', 'Coins', 'required|numeric|greater_than[0]');
			$this->form_validation->set_rules('payment_details', 'Payment Details', 'required');
			$this->form_validation->set_rules('payment_type', 'Payment Type', 'required');

			$this->form_validation->run();
			$error_array = $this->form_validation->error_array();

			$referral_data = getReferralIncomeDetails($userid);
			$Remaining_Coins = $referral_data['Remaining_Coins'];
			if($Remaining_Coins < $coins)
			{
				$error_array['coins'] = 'Not enough coins to sell.';	
			}

			if($created_date < date("2018-01-26"))
			{
				$error_array['coins'] = 'You can not sell coins before 26 January 2018.';
			}

			if(count($error_array) == 0 )
	        {
	        	$this->load->model('Coins_model');
				$coin_price_data = getCoinPrice(true);
				$coin_price = ($coin_price_data['coin_price'] ? $coin_price_data['coin_price'] : 0);	
				$amount = $coins * $coin_price;
				$this->Incentives_model->sell_referral_coins($userid,$coins,$amount,$coin_price,$payment_details,$payment_type,$created_date);
	        	$status = 'success';
			    $message = 'added successfully';
			    $status_code = 200;
	        }else
			{
				$status = 'error';
			    $message = $error_array;
			    $status_code = 501;
			}
			$response = array('status'=>$status,'message'=>$message);
			echo responseObject($response,$status_code);			
		}
	}
}
