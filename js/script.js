//JSON veri getirme
fetch('https://api.npoint.io/2d8b56210ccf0d7f3cf7')
  .then(cevap => cevap.json())
  .then(sozler => {
    let soz = document.getElementById("soz");
    let yazar = document.getElementById("yazar");
    let random = Math.floor(Math.random() * 7);

    soz.innerHTML = sozler["sozler"][random].soz;
    yazar.innerHTML = sozler["sozler"][random].sahibi;
  });


function veriekle(hangisine, saat, yazi, id) {
  let ekle = document.getElementById("div" + hangisine);
  ekle.innerHTML += `
    
    <tr class="cizilecek" id="${id}">
    <td>${saat}</td>
    <td>${yazi}</td>
    <td><i class="far fa-edit me-1 updateItem" id="updateItem"></td>
    <td><i class="far fa-trash-alt me-1 deleteItem" id="deleteItem"></i></button></td>
    </tr>
    `

}


function parcaekleme(sayi) {
  this.sayi = sayi;
  let parcasay = Math.floor(12 / sayi);




  let html = document.getElementById("part");


  for (i = 1; i <= sayi; i++) {

    html.innerHTML += ` 
        <div class='col-md-${parcasay} p-2 my-1'>
          <div class="myDiv">
             <h1 class="myh1">${i}.Part</h1>
      
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Event</th>
            
          </tr>
        </thead>
        <tbody class="trler" id="div${i}">
          
      </table>
    </div>
  </div>`

  }
}

//Storagedan çekme
function parcaekleLS() {
  let sayi = localStorage.getItem("sayi");
  parcaekleme(sayi);



  if (sayi != null || sayi > 0) {
    if (localStorage.getItem("etkinlik") != null) {
      let etkinlikler = JSON.parse(localStorage.getItem("etkinlik"))
      etkinlikler.forEach(e => {
        veriekle(e.hangisi, e.saati, e.yazisi, e.id);

      });
    }

  } else { }


}
parcaekleLS();


//toggle 
const toggle = document.querySelector('.toggle input');
toggle.addEventListener("click", () => {

  document.body.classList.toggle("darkMode");

})


// Modalı kapatmak için
document.getElementById("cancelButton").addEventListener("click", () => {


  document.getElementById("myModal").style.display = "none";
});

//kaç parça olacağının bilgisi
document.getElementById("bol").addEventListener("click", (e) => {
  if (localStorage.getItem("sayi") === null) {
    let sayi = document.getElementById("partsayisi").value;
    parcaekleme(sayi);


    localStorage.setItem("sayi", sayi)
    document.getElementById("partsayisi").value = "";
    e.preventDefault();
  } else {
    alert("You've already split!")
  }


})




//veri ekleme
document.getElementById("add").addEventListener("click", (e) => {
  let hangi = parseInt(document.getElementById("hangi").value);
  let saat = document.getElementById("saat").value;
  let yazi = document.getElementById("yazi").value;
  let gelenSayi = parseInt(localStorage.getItem("sayi"));

  if ((hangi <= gelenSayi) && (hangi > 0)) {

    if (localStorage.getItem("etkinlik") == null || JSON.parse(localStorage.getItem("etkinlik")).length == 0) {
      let etkinlik = [{
        hangisi: hangi,
        saati: saat,
        yazisi: yazi,
        id: 0
      }];

      localStorage.setItem("etkinlik", JSON.stringify(etkinlik));

    }
    else {
      let uzunluk = JSON.parse(localStorage.getItem("etkinlik")).length;
      let etkinlik1 = {
        hangisi: hangi,
        saati: saat,
        yazisi: yazi,
        id: JSON.parse(localStorage.getItem("etkinlik"))[uzunluk - 1]["id"] + 1
      };

      const etkinlikyeni = JSON.parse(localStorage.getItem("etkinlik"));
      etkinlikyeni.push(etkinlik1);
      localStorage.setItem("etkinlik", JSON.stringify(etkinlikyeni));
    }

    let uzunluk = JSON.parse(localStorage.getItem("etkinlik")).length;
    let id = JSON.parse(localStorage.getItem("etkinlik"))[uzunluk - 1]["id"]


    veriekle(hangi, saat, yazi, id);
    document.getElementById("hangi").value = "";
    document.getElementById("saat").value = "";
    document.getElementById("yazi").value = "";

    e.preventDefault();
  } else {
    alert(`There is not ${hangi}.part. Check it please !  `)
  }
});

//üstünü çizme, edit ve sil
document.getElementById("part").addEventListener("click", (e) => {
  //güncelleme
  if (e.target.classList.contains('updateItem')) {
    document.getElementById('add').style.display = 'none';
    document.getElementById('update').style.display = 'inline-block';
    document.getElementById('cancel').style.display = 'inline-block';

    document.getElementById("hideItem").value =
      e.target.parentElement.parentElement.id;




    document.getElementById("saat").value =
      e.target.parentElement.previousElementSibling.previousElementSibling.innerHTML;

    document.getElementById("yazi").value =
      e.target.parentElement.previousElementSibling.innerHTML;

    let idname = e.target.parentElement.parentElement.parentElement.getAttribute('id');
    idname = idname.substring(3, 4);
    document.getElementById("hangi").value = idname;
  }
  //silme
  if (e.target.classList.contains('deleteItem')) {

    let etkinliklerim = JSON.parse(localStorage.getItem("etkinlik"));
    let id = e.target.parentElement.previousElementSibling.parentElement.id;

    etkinliklerim.forEach(function (prd, index) {
      if (id == prd.id) {

        etkinliklerim.splice(index, 1);
      }
    });
    e.target.parentElement.parentElement.remove();
    localStorage.setItem("etkinlik", JSON.stringify(etkinliklerim));

  }



  //üstünü çizme
  if (e.target.parentElement.classList.contains('cizilecek')) {
    e.target.parentElement.classList.add("ciz");
  }


});


//deleteAll 
document.getElementById("deleteAll").addEventListener("click", (e) => {

  if (confirm("Tüm kayıtları silmek istiyor musunuz?")) {
    localStorage.removeItem("sayi");
    localStorage.removeItem("etkinlik");
  }
  else {
    e.preventDefault();
  }


})


//iptal (cancel)
document.getElementById("cancel").addEventListener("click", (e) => {

  document.getElementById('add').style.display = 'inline-block';
  document.getElementById('update').style.display = 'none';
  document.getElementById('cancel').style.display = 'none';

  document.getElementById("saat").value = "";
  document.getElementById("yazi").value = "";
  document.getElementById("hangi").value = "";





  e.preventDefault();
})

//update
document.getElementById("update").addEventListener("click", (e) => {
  //verileri alma 
  let idsi = document.getElementById("hideItem").value;
  let saat = document.getElementById("saat").value;
  let yazi = document.getElementById("yazi").value;
  let hangi = parseInt(document.getElementById("hangi").value);
  if ((hangi <= parseInt(localStorage.getItem("sayi"))) && (hangi > 0)) {
    //alınan verileri storagedaki gibi json formatına dönüştürme
    let product = {
      hangisi: hangi,
      saati: saat,
      yazisi: yazi,
      id: idsi
    };

    //storagedaki verileri getirme
    let etkinliklerim = JSON.parse(localStorage.getItem("etkinlik"));

    //gelen verileri tek tek dolaşıp bizim idmizle eşleşeni bulma 
    etkinliklerim.forEach(function (prd, index) {
      if (idsi == prd.id) {
        //eşleşen veriyi bulduktan sonra onu silip productı oraya ekleme
        etkinliklerim.splice(index, 1, product);
      }
    });
    // tüm ayarlamalar eklemeler bittikten sonra eldeki veriyi tekrar storagea yükleme
    localStorage.setItem('etkinlik', JSON.stringify(etkinliklerim));


    //anlık dönüşüm almak yerine sayfayı yenilesin diye (ajax belki burda kullanılabilir)
    window.location.reload(false);
  } else {
    alert(`There is not ${hangi}.part. Check it please !  `)
  }
})


