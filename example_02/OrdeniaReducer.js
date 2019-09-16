import * as at from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  loading: false,
  error: null,
  mostrarMensaje: false,
  tipoMensaje: 1,
  mensaje: '',
  // -------------------

  esFechaOrdMuyDistante: false,

  ordeniaId: 0,
  fecha: '',
  semana: '',

  data: [],

  loteId: '',
  lote: null,
  fechaCaptura: '',

  motivosSecado: [],
  gruposProductivos: [],

  animalesPorSecar: 0,
  animalesSinCaptura: 0,
  totalCaptura1: 0,
  totalCaptura2: 0,

  pesadaNoEncontrada: false,

  fechaCapturaPendiente: null,

}

// ----------------------------------------------------- Funciones GENERALES

const procesoIniciado = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const procesoFinalizado = (state, action) => {
  return updateObject(state, { error: null, loading: false });
};

const procesoError = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const mostrarOcultarMensaje = (state, action) => {
  return updateObject(state, {
    mostrarMensaje: action.mostrarMensaje,
    tipoMensaje: action.tipoMensaje,
    mensaje: action.mensaje
  });
}

const setMsgFechaMuyDistante = (state, action) => {
  return updateObject(state, {
    esFechaOrdMuyDistante: action.value
  });
}

const updFecha = (state, action) => {
  return updateObject(state, { fecha: action.fecha, semana: action.semana });
}

const setData = (state, action) => {
  let data = action.data;
  return updateObject(state, {
    ordeniaId: action.ordeniaId,
    loteId: action.lote.id,
    lote: action.lote,
    motivosSecado: action.motivosSecado, gruposProductivos: action.gruposProductivos,
    loteDestinoDefault: action.loteDestinoDefault,
    fechaCaptura: action.fechaCaptura,
    data,
  });

}

const setInformacionCapturaPendiente = (state, action) => {
  return updateObject(state, { fechaCapturaPendiente: action.capturaPendiente.fechaCaptura });
}

const marcarAnimalSecado = (state, action) => {

  let animales = [...state.data];

  let animalIdx = animales.findIndex((a => a.animalId === action.registroSeleccionado.animalId));

  if (animalIdx === -1) return updateObject(state);
  if (action.marcarSecado) {
    animales[animalIdx].secarAnimal = 1;
  } else {
    animales[animalIdx].secarAnimal = 0;

  }
  action.fn();
  return updateObject(state, { data: animales });

}

const actualizarStateVacas = (state, action) => {

  let data = [...state.data];
  let vacas = action.vacas;

  for (let v of vacas) {
    let animalIdx = data.findIndex((a => a.animalId === v.animalId));
    if (animalIdx > -1) {
      data[animalIdx].procesado = v.procesado;
      data[animalIdx].completo = v.completo;
    }
  }

  return updateObject(state, { data });

}

const setInformacionCaptura = (state, action) => {

  let loteId = action.loteId;
  let fechaCaptura = action.fecha;
  let lote = null;

  let animalesCapturados = 0;
  let animalesPorSecar = 0;
  let animalesSinCaptura = 0;
  let totalCaptura1 = 0;
  let totalCaptura2 = 0;

  if (action.informacionCaptura !== undefined) {
    lote = { ...action.informacionCaptura.lote };
    animalesCapturados = action.informacionCaptura.animalesCapturados;
    animalesPorSecar = action.informacionCaptura.animalesPorSecar;
    animalesSinCaptura = action.informacionCaptura.animalesSinCaptura;
    totalCaptura1 = action.informacionCaptura.totalCaptura1;
    totalCaptura2 = action.informacionCaptura.totalCaptura2;
  }

  return updateObject(state, {
    loteId, fechaCaptura, lote,
    animalesCapturados, animalesPorSecar, animalesSinCaptura, totalCaptura1, totalCaptura2
  });
}



const setPesadaNoEncontrada = (state, action) => {
  return updateObject(state, {
    pesadaNoEncontrada: action.pesadaNoEncontrada
  });
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case at.ORD_SET_PROCESO_INICIADO: return procesoIniciado(state, action);
    case at.ORD_SET_PROCESO_FINALIZADO: return procesoFinalizado(state, action);
    case at.ORD_SET_PROCESO_ERROR: return procesoError(state, action);
    case at.ORD_ADMINISTRAR_MENSAJE: return mostrarOcultarMensaje(state, action);


    case at.ORD_FECHA_MUY_DISTANTE: return setMsgFechaMuyDistante(state, action);
    case at.ORD_UPD_FECHA: return updFecha(state, action);

    case at.ORD_SET_DATA: return setData(state, action);
    case at.ORD_MARCAR_ANIMAL_SECADO: return marcarAnimalSecado(state, action);
    case at.ORD_UPD_STATE_VACAS: return actualizarStateVacas(state, action);
    case at.ORD_SET_INFORMACION_CAPTURA: return setInformacionCaptura(state, action);
    // case at.ORD_END_CAPTURA: return finalizarCaptura(state, action);
    case at.ORD_PESADA_NO_ENCONTRADA: return setPesadaNoEncontrada(state, action);
    case at.ORD_SET_DATOS_CAPTURA_PENDIENTE: return setInformacionCapturaPendiente(state, action);


    default:
      return state;
  }
};

export default reducer;


// FUNCIONES A DESECHAR
/*




const finalizarCaptura = (state, action) => {
  return updateObject(state, {
    fechaCaptura: action.fechaCaptura,
    loteId: action.action,
  });
}
*/