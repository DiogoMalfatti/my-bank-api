var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    console.log(this);
  }
};
xhttp.open("GET", "http://localhost:3000/account");
xhttp.send();
