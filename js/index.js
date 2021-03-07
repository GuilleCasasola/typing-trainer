// Codigo para juego de tipeado

var estado = 0;                
var juegoIniciado= false;
var lastTyped;

var texto;
var cantDeCaracteres=0;
var cantDeErrores=0;
var cantDeAciertos=0;
var horaInicio;
var horaFin;
var sonido;
var acentos = {
    'Á':'A',
    'É':'E',
    'Í':'I',
    'Ó':'O',
    'Ú':'U',
    'á':'a',
    'é':'e',
    'í':'i',
    'ó':'o',
    'ú':'u'
}
var banderaAcento = false;

$(document).ready(()=>{
    if(window.localStorage.getItem("sonido")=="On"){
        sonido=true;
    }else{
        $('#sonidoBtn').addClass('btn-danger');
        $('#sonidoBtn').removeClass('btn-success');
        $('#sonidoBtn').text("Sonido Off")
        sonido=false;
    }
})
// var listener = new window.keypress.Listener(this, {prevent_repeat: true})
// listener.simple_combo('key_left_bracket',hola);


function cargarTexto(){
    document.getElementById('mensaje').innerText= '';
    document.getElementById('resultado').style.opacity='0';
    document.getElementById('textoCargado').innerHTML= '';
    texto = document.getElementById('inputText').value;
    if(texto.length > 15 && texto.length <= 1000){
        for(i=0;i<texto.length;i++){
           span = document.createElement('span');
           span.setAttribute('id','letter'+i);
           span.innerText=texto[i];
           document.getElementById('textoCargado').appendChild(span);
        }
        cantDeCaracteres = texto.length;
        document.getElementById('addText').style= 'display:none';
        iniciarJuego()
    }else{
        document.getElementById('mensaje').innerText="Ingrese un texto entre 15 y 1000 caracteres";
    }
    
}

function reproducirAudio(){
    let audio = document.createElement("audio"); 
    audio.src = "./assets/sound.mp3"; 
    audio.play();
}
var handleKeyDown= function(tecla){
    if(estado== 0 && !juegoIniciado){
        juegoIniciado=true;
        horaInicio=Date.now();
    }
    skip = ['Alt', 'Control','Shift','CapsLock','AltGraph']
    if(!skip.includes(tecla.key)){

        if(sonido) reproducirAudio() ;

        if(tecla.key=='Backspace'){
            if(estado>0){
                estado--;
            }
            if( document.getElementById('letter'+estado).dataset.ok == 'true'){
                cantDeAciertos--;
            }
            document.getElementById('letter'+estado).style = ''
        }else{
            if(tecla.code == 'BracketLeft'){
                banderaAcento=true;
            }else {
                if((banderaAcento &&  acentos[texto[estado]] == tecla.key) || tecla.key == texto[estado]){
                    banderaAcento = false;
                    cantDeAciertos++;
                    lastTyped=true;
                    document.getElementById('letter'+estado).style = 'background-color:#8ced93'
                    document.getElementById('letter'+estado).dataset.ok=true;       //Guardo en el span si fue correcto.
                }else{
                    cantDeErrores++;
                    lastTyped=false;
                    document.getElementById('letter'+estado).style = 'background-color:#ed928c'
                    document.getElementById('letter'+estado).dataset.ok=false;
                }
                estado++;
                if(estado == texto.length){
                    horaFin=Date.now();
                    pararJuego();
                }
            }
           
        }
        
       
    }
    
    // var texto = document.getElementById("texto");
    // if(tecla.key == " "){
    //     startClock()
    // }  
};
function iniciarJuego(){
    document.addEventListener('keydown',handleKeyDown);
    
}
function pararJuego(){

    $('#modalResultados').modal('show');
    document.getElementById('resultado').style.opacity='1';
    document.removeEventListener('keydown',handleKeyDown);

    resultados= document.getElementById('resultado');

    let tiempo = ((horaFin - horaInicio)/1000);
    document.getElementById('tiempo').innerText = tiempo;
    document.getElementById('errores').innerText = cantDeErrores;
    document.getElementById('errCorregido').innerText = (cantDeErrores-(cantDeCaracteres-cantDeAciertos));
    
    
    document.getElementById('acierto').innerText = Math.round((cantDeAciertos*100)/cantDeCaracteres);
    document.getElementById('realAcierto').innerText =Math.round(((cantDeCaracteres-cantDeErrores)*100)/cantDeCaracteres);
    
    palabras = texto.split(" ").length;
    document.getElementById('cantPalabras').innerText = palabras;
    document.getElementById('cantCaracteres').innerHTML = texto.length;
    document.getElementById('ppm').innerText =((60*palabras)/tiempo).toFixed(2);

    document.getElementById('addText').style= '';
   

    reiniciarVariables()
}

function reiniciarVariables(){
    estado = 0;
    juegoIniciado= false;
    cantDeCaracteres=0;
    cantDeErrores=0;
    cantDeAciertos=0;
}

function adSound(){
    $('#sonidoBtn').blur();
    if(window.localStorage.getItem("sonido")=="On"){
        window.localStorage.setItem("sonido",'Off');
        $('#sonidoBtn').addClass('btn-danger');
        $('#sonidoBtn').removeClass('btn-success');
        $('#sonidoBtn').text("Sonido Off");
        sonido = false;
    }else{
        window.localStorage.setItem("sonido",'On');
        $('#sonidoBtn').addClass('btn-success');
        $('#sonidoBtn').removeClass('btn-danger');
        $('#sonidoBtn').text("Sonido On")
        sonido = true;
    }
}