angular.module("MyApp", []).controller("MyController", function($scope,$http) {
    $scope.r_username = '';
    $scope.r_email = '';
    $scope.r_mobile = '';
    $scope.r_password = '';
    $scope.r_password1 = '';

    $scope.register = function(sponsername,placement)
    {
        sponsername = sponsername || '';
        placement = placement || '';
        register_success_cb = function(data)
        {
            if(data.status == "success")
            {
                alert_box('User registered successfully.');
                $("#registration_step1").hide();
                $("#registration_step2").show();
            }
        }
        
        if($scope.r_password != $scope.r_password1)
        {
            alert_box('Please enter same password');
            return false;
        }
        request_data = {}
        request_data['username'] = $scope.r_username;
        request_data['email'] = $scope.r_email;
        request_data['mobile'] = $scope.r_mobile;
        request_data['password'] = $scope.r_password;
        request_data['sponserUsername'] = sponsername;
        request_data['placement'] = placement;        
        SSK.site_call("AJAX",window._site_url+"register/signUp",request_data, register_success_cb);
    }

    $scope.check_otp = function()
    {
        sponsername = $scope.otp || '';
        placement = $scope.r_username || '';
        check_otp_success_cb = function(data)
        {
            if(data.status == "success")
            {
                alert_box('Successfully Verified.');
                window.location.href=window._site_url+'profile';
            }
        }
        
        request_data = {}
        request_data['username'] = $scope.r_username;
        request_data['otp'] = $scope.otp;
        SSK.site_call("AJAX",window._site_url+"register/check_otp",request_data, check_otp_success_cb);
    }

    $scope.resend_otp = function()
    {
        placement = $scope.r_username || '';
        resend_otp_success_cb = function(data)
        {
            alert_box('Successfully sent OTP.');
            
        }
        
        request_data = {}
        request_data['username'] = $scope.r_username;
        SSK.site_call("AJAX",window._site_url+"register/resend_otp",request_data, resend_otp_success_cb);
    }

    $scope.forgot_password = function()
    {
        forgot_password_success_cb = function(data)
        {
            if(data.status == "success")
            {
                alert_box('Check your email id or Mobile for new password.');       
            }
        }
        request_data = {}
        request_data['username'] = $scope.forgot_username;
        SSK.site_call("AJAX",window._site_url+"login/forgot_password_otp",request_data, forgot_password_success_cb);
    }
    $scope.forgot_password_token = window._forgot_password_token;
    $scope.change_password = function()
    {
        change_password_success_cb = function(data)
        {
            if(data.status == "success")
            {
                alert_box('Successfully changed password.');
            }
        }

        if($scope.new_password == '')
        {
            alert_box('Please enter New Password field.')
        }else if($scope.reenter_password == '')
        {
            alert_box('Please enter Re-Enter Password field.');
        }else if($scope.new_password != $scope.reenter_password)
        {
            alert_box('Please enter same passwords.');
        }
        
        request_data = {}
        request_data['password'] = $scope.new_password;
        request_data['forgot_password_token'] = $scope.forgot_password_token;
        
        SSK.site_call("AJAX",window._site_url+"login/change_password",request_data, change_password_success_cb);
    }

    $scope.login = function()
    {
        login_success_cb = function(data)
        {
            if(data.status == "success")
            {
                window.location.href = window._site_url+"dashboard";
            }else if(data.status == 'failed')
            {
                alert_box(data.message);
            }
        }

        login_failure_cb = function(data)
        {
            if(data.message[0] == 'Verification not completed')
            {
                $("#login_cart").hide();
                $("#otp_cart").show();
                $scope.r_username = $scope.login_username;
                $scope.resend_otp();
            }
        }

        request_data = {}
        request_data['username'] = $scope.login_username;
        request_data['password'] = $scope.login_password;
        SSK.site_call("AJAX",window._site_url+"login/signIn",request_data, login_success_cb,login_failure_cb);
    }
});