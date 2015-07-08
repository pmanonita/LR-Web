document.write(
  "<nav class='navbar navbar-default navbar-inverse' role='navigation'>" +
  "<div class='container-fluid' ng-controller='LoginCtrl'>"+  
    
    "<div class='navbar-header pull-left'>"+
      "<ul class='nav navbar-nav pull-left'>"+
        "<li class=\"active\" ng-show=\"isActive('/lrhome')\"><a href='/createlr'>LR</a></li>"+
        "<li ng-show=\"isActive('/lrhome')\"><a href='/createlr'>REPORTS</a></li>"+
      "</ul>"+
    "</div>"+

    "<div class='collapse navbar-collapse navbar-right'>"+
      "<ul class='nav navbar-nav'>"+
        "<li class='dropdown' ng-show=\"isActive('/lrhome')\">"+
          "<a href='/lrhome' class='dropdown-toggle' data-toggle='dropdown'>PROFILE <b class='caret'></b></a>"+
          "<ul class='dropdown-menu'>"+
            "<li><a href='#'>Change Password</a></li>"+
            "<li role='separator' class='divider'></li>"+
            "<li><a href='#'>Update Profile Info</a></li>"+
            "<li role='separator' class='divider'></li>"+
            "<li><a href='#'>Log Off</a></li>"+            
         "</ul>"+
        "</li>"+

      "</ul>"+

    "</div><!-- /.navbar-collapse -->"+
  "</div><!-- /.container-fluid -->"+

  "</nav>");


 