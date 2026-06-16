import { useState } from 'react';

export default function CalculadoraPromedio() {
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 1, nota: '', porcentaje: '' },
    { id: 2, nota: '', porcentaje: '' },
    { id: 3, nota: '', porcentaje: '' },
    { id: 4, nota: '', porcentaje: '' }
  ]);
  
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const manejarCambio = (id, campo, valor) => {
    const nuevasEvaluaciones = evaluaciones.map((ev) => 
      ev.id === id ? { ...ev, [campo]: valor } : ev
    );
    setEvaluaciones(nuevasEvaluaciones);
    setError(null);
    setResultado(null);
  };

  const calcularPromedio = () => {
    setError(null);
    setResultado(null);

    let sumaPorcentajes = 0;
    let sumaNotas = 0;
    
    let filasIncompletas = false;
    let notasInvalidas = false;
    let porcentajesInvalidos = false;

    const evaluacionesActivas = evaluaciones.filter(ev => ev.nota !== '' || ev.porcentaje !== '');

    if (evaluacionesActivas.length === 0) {
      setError("Ingresa al menos una nota y su porcentaje para calcular.");
      return;
    }

    evaluacionesActivas.forEach((ev) => {
      if (ev.nota === '' || ev.porcentaje === '') {
        filasIncompletas = true;
        return; 
      }

      const notaNum = parseFloat(ev.nota);
      const porcNum = parseFloat(ev.porcentaje);

      if (notaNum < 1.0 || notaNum > 7.0) {
        notasInvalidas = true;
      }

      if (porcNum <= 0 || porcNum > 100) {
        porcentajesInvalidos = true;
      }

      sumaPorcentajes += porcNum;
      sumaNotas += notaNum * (porcNum / 100);
    });

    if (filasIncompletas) {
      setError("Tienes filas a medias. Asegúrate de poner la nota y el porcentaje juntos.");
      return;
    }

    if (notasInvalidas) {
      setError("¡Datos incorrectos! Las notas deben estar en el rango de 1.0 a 7.0.");
      return;
    }

    if (porcentajesInvalidos) {
      setError("¡Datos incorrectos! Los porcentajes deben ser válidos (1 a 100).");
      return;
    }

    if (sumaPorcentajes > 100) {
      setError(`¡Te pasaste! Los porcentajes suman ${sumaPorcentajes}%. No pueden superar el 100%.`);
      return;
    }

    const promedioRedondeado = Math.round(sumaNotas * 10) / 10;
    const porcentajeFaltante = 100 - sumaPorcentajes;
    let notaRequerida = 0;
    let nivelAprobacion = '';

    if (porcentajeFaltante > 0) {
      notaRequerida = (3.95 - sumaNotas) / (porcentajeFaltante / 100);
    } else {
      if (promedioRedondeado < 4.0) {
        nivelAprobacion = 'reprobado';
      } else if (promedioRedondeado >= 4.0 && promedioRedondeado < 5.0) { 
        nivelAprobacion = 'regular'; 
      } else {
        nivelAprobacion = 'destacado'; 
      }
    }

    setResultado({
      promedioParcial: promedioRedondeado.toFixed(1),
      sumaPorcentajes,
      porcentajeFaltante,
      notaRequerida: notaRequerida.toFixed(1),
      nivelAprobacion
    });
  };

  const obtenerClaseResultado = () => {
    if (resultado.nivelAprobacion === 'destacado') return 'caja-resultado caja-destacado';
    if (resultado.nivelAprobacion === 'regular') return 'caja-resultado caja-regular';
    return 'caja-resultado caja-reprobado';
  };

  return (
    <div className="calculadora-contenedor">
      <h2 className="titulo">Calculadora de Notas</h2>
      
      {evaluaciones.map((ev, index) => (
        <div key={ev.id} className="fila-nota">
          <label>Nota {index + 1}:</label>
          <input
            type="number" step="0.1" placeholder="Ej: 5.5" className="input-estetico" value={ev.nota}
            onChange={(e) => manejarCambio(ev.id, 'nota', e.target.value)}
          />
          <input
            type="number" placeholder="% Ej: 30" className="input-estetico" value={ev.porcentaje}
            onChange={(e) => manejarCambio(ev.id, 'porcentaje', e.target.value)}
          />
        </div>
      ))}

      <button onClick={calcularPromedio} className="btn-calcular">
        Calcular Promedio
      </button>

      {error && (
        <div role="alert" aria-live="assertive" className="caja-resultado caja-error">
          <p style={{ margin: 0, fontWeight: 'bold' }}>{error}</p>
        </div>
      )}

      {/* CAJA 1: Cálculo Parcial */}
      {!error && resultado && resultado.porcentajeFaltante > 0 && (
        <div className="caja-resultado caja-parcial">
          <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>Cálculo Parcial</h3>
          <p style={{ margin: '5px 0' }}>Has ingresado el <strong>{resultado.sumaPorcentajes}%</strong> de tus notas.</p>
          <p style={{ margin: '5px 0', color: '#fcd34d' }}>Puntos por rellenar: <strong>{resultado.porcentajeFaltante}%</strong></p>
          <hr style={{ borderColor: 'rgba(56, 189, 248, 0.3)', margin: '15px 0' }} />
          
          {resultado.notaRequerida > 7.0 ? (
            <p style={{ margin: 0, color: '#f43f5e', fontWeight: 'bold' }}>Ni sacándote un 7.0 te da para el 4.0. ☠️</p>
          ) : resultado.notaRequerida <= 1.0 ? (
            <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>¡Tranquilidad! Ya tienes el ramo aprobado. 🎉</p>
          ) : (
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              Necesitas promediar un <span style={{ color: '#fcd34d', fontSize: '1.2em' }}>{resultado.notaRequerida}</span> en el {resultado.porcentajeFaltante}% restante para aprobar.
            </p>
          )}
        </div>
      )}

      {/* CAJA 2: Resultado Final */}
      {!error && resultado && resultado.porcentajeFaltante === 0 && (
        <div className={obtenerClaseResultado()}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Promedio Final: {resultado.promedioParcial}</h3>
          
          {resultado.nivelAprobacion === 'destacado' && (
            <p style={{ margin: 0, color: '#34d399', fontWeight: 'bold' }}>¡Aprobado! Excelente rendimiento. 🏆</p>
          )}
          {resultado.nivelAprobacion === 'regular' && (
            <p style={{ margin: 0, color: '#fbbf24', fontWeight: 'bold' }}>¡Aprobado! Pasaste el ramo. 👍</p>
          )}
          {resultado.nivelAprobacion === 'reprobado' && (
            <p style={{ margin: 0, color: '#fb7185', fontWeight: 'bold' }}>Reprobado. A intentarlo de nuevo a la próxima. 💪</p>
          )}
        </div>
      )}
    </div>
  );
}