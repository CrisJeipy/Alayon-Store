
	var canvas = document.getElementById('fuego');
	var contexto = canvas.getContext('2d');
	var ancho = canvas.width;
	var alto = canvas.height;
	// paleta de colores
	var paleta = new Array(256);
	// crea la imagen
	var imagen = contexto.createImageData(canvas.width,canvas.height);
	// array paralelo al ImageData para almacenar el color de los pixeles
	var fuego = new Array(alto*ancho);
	// fotogramas por segundo
	var fps = 25;
	// multiplicador para generar focos iniciales de llamas
	var limite = 0.5;
	// tiempo inicial para calcular los fps
	var tiempo = new Date().getTime();
	// altura del fuego
	var alturaLlama = 1;
	var i;

	// rellenado de paleta -> [rojo,verde,azul,alfa]
	// negro a rojo
	for(i = 0; i < 64; i++) paleta[i] = [i*4,0,0,255];

	// rojo a amarillo
	for(i = 0; i < 64; i++) paleta[i+64] = [255,i*4,0,255];

	// amarillo a blanco
	for(i = 0; i < 64; i++) paleta[i+128] = [255,255,i*4,255];

	// blanco
	for(i = 0; i < 64; i++) paleta[i+192] = [255,255,255,255];

	// rellena con negro
	for(i = 0; i < fuego.length; i++) fuego[i] = 0;

	// función para alternar el límite
	function randomLimite() {
		limite += Math.random() * 0.2 - 0.1;
		limite = Math.min(Math.max(limite, 0.5), 0.8);
	}
	
	// función principal que se repetirá;
	function quema()
	{
		// repite la función
		window.requestAnimationFrame(quema);

		var ya = new Date().getTime();
		
		// salta función si no toca fotograma
		if ((ya - tiempo) < (1000 / fps)) return;
		
		// actualiza el tiempo
		tiempo = ya;

		var c,puntos,color;

		// ((X,Y) + (X-1,Y+1) + (X,Y+1) + (X+1,Y+1)) / 4
		c = fuego.length - 1;
		while(c >= 0)
		{
			// color actual
			color = 0;
			// número divisor según cuantos puntos se hayan sumado, puede ser 3 o 4
			puntos = 0;

			// todo menos última línea
			if(c < (fuego.length - ancho))
			{
				color = fuego[c];
				color += fuego[c+ancho];
				puntos = 2;

				// comprueba borde izquierdo
				if((c % ancho) > 0)
				{
					puntos++;
					color += fuego[c + (ancho - 1)];
				}
				

				// comprueba borde derecho
				if(((c + 1) % ancho) > 0)
				{
					puntos++;
					color += fuego[c + ancho + 1];
				}

				color=Math.floor(color / puntos);
				// altura del fuego
				if(color > alturaLlama) color--;
				fuego[c] = color;


				// Rellena el ImageData con el array fuego
				imagen.data[c * 4] = paleta[color][0];			// rojo
				imagen.data[(c * 4) + 1] = paleta[color][1];	// verde
				imagen.data[(c * 4) + 2] = paleta[color][2];	// azul
				imagen.data[(c * 4) + 3] = paleta[color][3];	// alfa
			}
			else
			{
				// última línea, no se pasa a la imagen, son puntos blancos y negros que no pegan
				if(Math.random() > limite) color = 255;
				fuego[c] = color;
			}

			c--;
		}

		contexto.putImageData(imagen,0,0);

		if (Math.random() > 0.95) randomLimite();
	}

	window.requestAnimationFrame(quema);
