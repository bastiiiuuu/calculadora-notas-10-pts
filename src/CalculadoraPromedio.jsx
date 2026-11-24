/**
 * La ponderación se calcula sobre el 100 % del curso. Una fila completamente vacía no
 * participa, pero una fila incompleta se rechaza. La estimación del porcentaje pendiente usa
 * la regla explícita del ejercicio y redondea el mínimo requerido hacia arriba.
 */
import { useState } from 'react';
import { requiredGrade } from './gradeMath';

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

      if (!Number.isFinite(notaNum) || notaNum < 1.0 || notaNum > 7.0) {
        notasInvalidas = true;
      }

      if (!Number.isFinite(porcNum) || porcNum <= 0 || porcNum > 100) {
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
      notaRequerida = requiredGrade(sumaNotas, porcentajeFaltante);
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
      <h1 className="titulo">Calculadora de notas</h1>
      <p>Escala 1,0 a 7,0. Este ejercicio supone aprobación desde 3,95 antes de redondear; verifica la regla de tu asignatura.</p>
      
      {evaluaciones.map((ev, index) => (
        <div key={ev.id} className="fila-nota">
          <label htmlFor={`nota-${ev.id}`}>Nota {index + 1}:</label>
          <input
            id={`nota-${ev.id}`} type="number" min="1" max="7" step="0.1" placeholder="Ej: 5.5" className="input-estetico" value={ev.nota}
            onChange={(e) => manejarCambio(ev.id, 'nota', e.target.value)}
          />
          <input
            aria-label={`Porcentaje de la nota ${index + 1}`} type="number" min="0.1" max="100" step="0.1" placeholder="% Ej: 30" className="input-estetico" value={ev.porcentaje}
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

      {!error && resultado && resultado.porcentajeFaltante > 0 && (
        <div className="caja-resultado caja-parcial">
          <h3 style={{ margin: '0 0 10px 0', color: '#7dd3fc' }}>Cálculo Parcial</h3>
          <p style={{ margin: '5px 0' }}>Has ingresado el <strong>{resultado.sumaPorcentajes}%</strong> de tus notas.</p>
          <p style={{ margin: '5px 0', color: '#fde047' }}>Puntos por rellenar: <strong>{resultado.porcentajeFaltante}%</strong></p>
          <hr />
          
          {resultado.notaRequerida > 7.0 ? (
            <p style={{ margin: 0, color: '#fca5a5', fontWeight: 'bold' }}>Con la ponderación ingresada, una nota 7,0 no alcanza el umbral de aprobación.</p>
          ) : resultado.notaRequerida <= 1.0 ? (
            <p style={{ margin: 0, color: '#6ee7b7', fontWeight: 'bold' }}>Con estos valores, una nota 1,0 en el porcentaje restante alcanza el umbral del ejercicio.</p>
          ) : (
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              Necesitas promediar un <span style={{ color: '#fde047', fontSize: '1.2em' }}>{resultado.notaRequerida}</span> en el {resultado.porcentajeFaltante}% restante para aprobar.
            </p>
          )}
        </div>
      )}

      {!error && resultado && resultado.porcentajeFaltante === 0 && (
        <div className={obtenerClaseResultado()}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Promedio Final: {resultado.promedioParcial}</h3>
          
          {resultado.nivelAprobacion === 'destacado' && (
            <p style={{ margin: 0, color: '#6ee7b7', fontWeight: 'bold' }}>¡Aprobado! Excelente rendimiento. 🏆</p>
          )}
          {resultado.nivelAprobacion === 'regular' && (
            <p style={{ margin: 0, color: '#fde047', fontWeight: 'bold' }}>¡Aprobado! Pasaste el ramo. 👍</p>
          )}
          {resultado.nivelAprobacion === 'reprobado' && (
            <p style={{ margin: 0, color: '#fda4af', fontWeight: 'bold' }}>Reprobado. A intentarlo de nuevo a la próxima. 💪</p>
          )}
        </div>
      )}
    </div>
  );
}