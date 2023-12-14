$("form[name=signup_form").submit(function(e) {

  var $form = $(this);
  var $error = $form.find(".error");
  var data = $form.serialize();

  $.ajax({
    url: "/user/signup",
    type: "POST",
    data: data,
    dataType: "json",
    success: function(resp) {
      // console.log(resp)
      window.location.href = "/dashboard/";
    },
    error: function(resp) {
      $error.text(resp.responseJSON.error).removeClass("error--hidden");
    }
  });

  e.preventDefault();
});

$("form[name=login_form").submit(function(e) {

  var $form = $(this);
  var $error = $form.find(".error");
  var data = $form.serialize();

  $.ajax({
    url: "/user/login",
    type: "POST",
    data: data,
    dataType: "json",
    success: function(resp) {
      window.location.href = "/dashboard/";
    },
    error: function(resp) {
      $error.text(resp.responseJSON.error).removeClass("error--hidden");
    }
  });

  e.preventDefault();
});

// 設定秒數
var count = 15;
function countDown(){
	// 將秒數寫在指定元素中
	document.getElementById("timeBox").innerHTML= count;
	// 每次執行就減1
	count -= 1;
	// 當 count = 0 時跳轉頁面
	if (count == 0){
		location.href="/get_todos";
	}
	// 設定每秒執行1次
	setTimeout("countDown()",1000);
}
// 執行 countDown
countDown();

function search(){ //測試
  item = document.getElementById('innerSearch');
  return item;
}