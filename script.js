 //clicar enter envia o formulario
/*
botao desabilitado quando input="", ao passar o mouse por cima do botao
acione algum tipo de alerta avisando "digite algo no input" ou algo asssim
*/

let input = document.querySelector("input[name=query]")
let botao = document.querySelector("#botao")
let divTabelas = document.querySelector("#tabelas")
let divErro = document.createElement("div")

let MainDiv = document.querySelector("#app")
// REMOVIDA A LINHA: MainDiv.style.marginRight = "0px"
MainDiv.style.position = "relative" 
MainDiv.style.paddingTop = "60px" 

input.addEventListener("focus", () => {
       botao.style.transition = "transform 0.3s ease"
       botao.style.transform = "translateX(30px)"
})
input.addEventListener("blur", () => {
       botao.style.transition = "transform 0.5s ease-in-out"
       botao.style.transform = "translateX(0px)"

})

function verificarInput() {
    if (input.value.trim() === "") {
        botao.disabled = true;
        botao.title = "Por favor, digite o nome de uma cidade."; 
    } else {
        botao.disabled = false;
        botao.title = ""; 
    }
}

input.addEventListener("input", verificarInput);
verificarInput(); 

input.addEventListener("keydown", (e) => {
    if(e.key == "Enter" && !botao.disabled){
        query()
    }
})

let i = 0
botao.onclick = query

function query(){
       let cidade = document.querySelector("input[name=query]")

       axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade.value}`, {
              params: {
              appid: "cd0c20558ec028bff08fbe7b2c3cd95e",
              units: "metric",
              lang: "pt_br"
       }})
       .then((response) => {
        
              if(response.data && response.data.cod === 200){
                     txtCidade = document.createTextNode("🏙️" + response.data.name);
                     txtNuvem = document.createTextNode("☁️" + response.data.weather[0].description);
                     txtTemp = document.createTextNode(`🌡️ ${response.data.main.temp}°C`);
          	  txtUmid = document.createTextNode(`🌧️ Umidade: ${response.data.main.humidity}%`);
                     txtVento = document.createTextNode(`💨 Vento: ${response.data.wind.speed} m/s`);
      	  }
          	  else{
            	  throw new Error("Cidade não encontrada");
  	  }
          	  divErro.innerHTML = "" 

          	  let city = document.createElement("span")
          	  city.id = `id${i}`
  	  city.appendChild(txtCidade)

  	  let ceu = document.createElement("span")
  	  ceu.id = `id${i}`
  	  ceu.appendChild(txtNuvem)

  	  let temperatura = document.createElement("span")
  	  temperatura.id = `id${i}`
  	  temperatura.appendChild(txtTemp)

  	  let chuva = document.createElement("span")
  	  chuva.id = `id${i}`
  	  chuva.appendChild(txtUmid)

  	  let vento = document.createElement("span")
  	  vento.id = `id${i}`
  	  vento.appendChild(txtVento)

  	  let divResult = document.createElement("div")
  	  divResult.id = `id${i}`
      
  	  divResult.setAttribute("class", "container text-center")
  	  divResult.style.marginBottom = "15px"
  	  divResult.style.backgroundColor = "#596968"
  	  divResult.style.borderRadius = "5px"

  	  divResult.appendChild(city)
  	  divResult.appendChild(ceu)
  	  divResult.appendChild(temperatura)
  	  divResult.appendChild(chuva)
  	  divResult.appendChild(vento)
      
  	  divTabelas.appendChild(divResult)
  	  divTabelas.style.display = "flex"
  	  divTabelas.style.flexDirection = "column"
  	  divTabelas.style.gap = "10px"

  	  let spans = document.querySelectorAll(`span[id=id${i}]`)
  	  spans.forEach(span =>span.style.display = "block")
      
  	  i++
  	  cidade.value = ""
        verificarInput() 
  	})
  	.catch((error) => {
      	  console.log(error); 
      	  let msgErro = document.createElement("button")
      	  msgErro.setAttribute("class", "btn btn-outline-danger")
      	  msgErro.setAttribute("disabled", "")
      	  msgErro.style.color = "white"
      	  msgErro.appendChild(document.createTextNode("Por favor insira uma cidade válida"))

      	  divErro.innerHTML = "" 
      	  divErro.setAttribute("class", "text-center")
      	  divErro.appendChild(msgErro)
      	  divTabelas.appendChild(divErro)
  	})
}


if(navigator.geolocation){
  	navigator.geolocation.getCurrentPosition(success, error)
}
else{
  	console.log("Geolocalização não suportada.")
}

function error(){
  	console.log("Usuario não permitiu acesso a localização")
}

async function success(position) {
    console.log("Geolocalização obtida.");

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const OpenCageKey = "91fc577d5e1742159e501bb37a7eb759";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OpenCageKey}&language=pt-BR`;

    try{
        const response = await fetch(url);
        const data = await response.json();
        let userLocation = ""; 
        if(data.results[0].components !== null){
            const components = data.results[0].components
            userLocation = components.city ||
                            components.town ||
                            components.village ||
                            components.state ||
                            components.county
        }

        const apiKey = "cd0c20558ec028bff08fbe7b2c3cd95e"
        
        const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${apiKey}&units=metric&lang=pt_br`)
        
        if(!response2.ok){
            throw new Error(`Erro na busca do clima: status ${response2.status}`)
        }
        
        const dados = await response2.json()

        let divUserLocation = document.createElement("div")
        
        // REMOVIDA A LINHA: divUserLocation.setAttribute("class", "container text-center")
        
        divUserLocation.style.position = "absolute";
        divUserLocation.style.right = "10px";
        divUserLocation.style.top = "10px"; 
        divUserLocation.style.padding = "8px 12px";
        divUserLocation.style.backgroundColor = "#2b4e4e";
        divUserLocation.style.color = "white";
        divUserLocation.style.borderRadius = "5px";
        divUserLocation.style.fontWeight = "bold";   
        divUserLocation.style.textAlign = "center"; // Adicionado para garantir a centralização do texto

        console.log(dados.name)
        let SpanUserLocation = document.createElement("span")
        SpanUserLocation.appendChild(document.createTextNode("📍 " + dados.name)) 

        divUserLocation.appendChild(SpanUserLocation)
        MainDiv.appendChild(divUserLocation) 
    }
    catch(err){
        console.log("Ocorreu um erro ao buscar localização/clima:", err) 
    }
}

//91fc577d5e1742159e501bb37a7eb759 API OpenCage
//cd0c20558ec028bff08fbe7b2c3cd95e API Openweather


              /*//Limpa as divs antes de adicionar novos dados
              document.querySelector("#cidade").textContent = "";
              document.querySelector("#ceu").textContent = "";
              document.querySelector("#temperatura").textContent = "";
              document.querySelector("#chuva").textContent = "";
              document.querySelector("#vento").textContent = "";      

              // Adiciona direto nas divs
              let city = document.querySelector("#cidade").appendChild(txtCidade);
              let ceu = document.querySelector("#ceu").appendChild(txtNuvem);
              let temperatura = document.querySelector("#temperatura").appendChild(txtTemp);
              let chuva = document.querySelector("#chuva").appendChild(txtUmid);
              let vento = document.querySelector("#vento").appendChild(txtVento);

              let divResult = document.querySelector("#resultado")

              divResult.style.backgroundColor = "#596968"
              divResult.style.borderRadius = "5px"*/