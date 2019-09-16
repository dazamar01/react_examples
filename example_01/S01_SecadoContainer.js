import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as sec from '../../store/actions/SecadoAction';
import * as at from '../../store/actions/index';
import * as CONSTANTES from '../../shared/constantes';

// components area
import Alerta from '../../components/general/AlertComponent';
import Aux from '../../hoc/Aux/Aux';
import Button from '../../components/general/ButtonComponent';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import CommonRow from '../../components/general/SimpleRowComponent';
import ConfirmacionCaptura from '../../components/general/ConfirmacionCapturaComponent';
import ConfirmacionEliminarPesada from '../../components/Ordenia/ConfirmacionEliminarPesadaComponent';
import Container from 'react-bootstrap/Container';
import Encabezado from '../../components/general/EncabezadoComponent';
import Loader from '../../components/general/LoaderComponent';
import Row from 'react-bootstrap/Row';
import SinPesada from '../../components/Ordenia/SinPesadaComponent';
import Ubicacion from '../../components/general/UbicacionComponent';



const ENCABEZADOS = {
  INICIO: 'Seleccione ubicacion',
  ORDENIA_EN_PROCESO: 'Imposible continuar: Captura de ordeña en proceso',
  PANEL_CONFIRMACION: ''
};

const OPCIONES_PESADA_PENDIENTE = {
  CONTINUAR: 'CONTINUAR',
  ELIMINAR: 'ELIMINAR',
  CANCELAR: 'CANCELAR',
};

const STEPS = CONSTANTES.SECADO_STEPS;
const moment = require('moment')
class S01_SecadoContainer extends PureComponent {

  state = {
    encabezado: ENCABEZADOS.INICIO,
    step: STEPS.INICIO,

    ranchoSeleccionado: undefined,
    potreroSeleccionado: undefined,

    ubicacion: '',
    opcionCapturaPendiente: OPCIONES_PESADA_PENDIENTE.CONTINUAR,
    goToCaptura: false,
  }

  salir = () => {
    this.setState({ salir: true });
  }

  // --------------------------------------------------------------------------- FUNCIONALIDADES DEL FORM
  alertaHandler = (mostrarMensaje, tipoMensaje, mensaje) => {
    this.props.onMostrarOcultarMensaje(mostrarMensaje, tipoMensaje, mensaje);
  }

  onRanchoIdChangeHandler = (ranchoSeleccionado) => {
    // console.log('Rancho: ', ranchoSeleccionado);
    this.setState({
      ranchoSeleccionado
    })

    let params = {
      rancho: ranchoSeleccionado
    };
    this.setEncabezado(params);

    // quitar los mensajes de validacion
    this.alertaHandler(false, CONSTANTES.ALERT_TIPO_MSG.WARNING, '');

  }

  onPotreroIdChangeHandler = (potreroSeleccionado) => {
    this.setState({
      potreroSeleccionado
    })
    let params = {
      potrero: potreroSeleccionado
    };
    this.setEncabezado(params);

    // quitar los mensajes de validacion
    this.alertaHandler(false, CONSTANTES.ALERT_TIPO_MSG.WARNING, '');
  }

  onLoteIdChangeHandler = (lote) => {
    // console.log('Lote: ', lote);
    let params = {
      lote
    };
    this.setEncabezado(params);
    this.props.onSetLoteCaptura(lote);

    // quitar los mensajes de validacion
    this.alertaHandler(false, CONSTANTES.ALERT_TIPO_MSG.WARNING, '');
  }

  onFechaCapturaChangeHandler = (e) => {
    let fechaCaptura = e.target.value;
    console.log('set>fechaCaptura',fechaCaptura);
    this.props.onSetFechaCaptura(fechaCaptura);

    console.log(fechaCaptura);
    if (fechaCaptura !== '') {
      let fecha = moment(fechaCaptura);
      let params = {
        fechaCaptura: '' + fecha.format("DD/MM/YYYY")
      };
      this.setEncabezado(params);
    }

    // quitar los mensajes de validacion
    this.alertaHandler(false, CONSTANTES.ALERT_TIPO_MSG.WARNING, '');
  }

  setEncabezado = (params) => {
    if (STEPS.INICIO === this.state.step) {

      let ubicacion = this.state.ubicacion;

      if (params.rancho !== undefined) {
        ubicacion = params.rancho.nombre;
        this.setState({
          encabezado: 'Ubicacion: ' + ubicacion,
          ubicacion,
        });
      }
      if (params.potrero !== undefined) {
        ubicacion += ", " + params.potrero.nombre;
        this.setState({
          encabezado: 'Ubicacion: ' + ubicacion,
          ubicacion
        })
      }
      if (params.lote !== undefined) {
        ubicacion += ", " + params.lote.nombre;
        this.setState({
          encabezado: 'Ubicación: ' + ubicacion,
          ubicacion
        })
      }
      if (params.fechaCaptura !== undefined) {
        this.setState({
          encabezado: 'Ubicación: ' + ubicacion + '. Fecha: ' + params.fechaCaptura,
        })
      }
    }
  }

  limpiarUbicacion = () => {
    // actualizar el store
    this.props.onLimpiarUbicacion();
    //actualizar el state
    this.setState({
      ranchoSeleccionado: undefined,
      potreroSeleccionado: undefined,
    });
  }

  limpiarFecha = () => {
    this.props.onLimpiarFechaCaptura('');
    this.props.onLimpiarSemanaCaptura('');
  }

  limpiarHandler = () => {
    if (STEPS.INICIO === this.state.step) {
      // limpiar ubicacion, fecha, todo
      this.setState({
        encabezado: ENCABEZADOS.INICIO,
      });
      this.limpiarUbicacion();
      this.limpiarFecha();
    }
  }
  // --------------------------------------------------------------------------- FUNCIONALIDADES DEL FORM: FIN

  validar = () => {

    if (this.state.ranchoSeleccionado === undefined) {
      this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, 'Seleccione Rancho.');
      return;
    }

    if (this.state.potreroSeleccionado === undefined) {
      this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, 'Seleccione Potrero.');
      return;
    }

    if (this.props.lote === '') {
      this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, 'Seleccione Lote.');
      return;
    }

    if (this.props.fechaCaptura === '') {
      this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, 'Seleccione la fecha de esta captura.');
      return;
    }

    this.props.onValidarProcesoSecado(this.props.loteId, this.props.fechaCaptura, this.mostrarOrdeniaEnProceso, this.evaluarStep);

  }

  mostrarPrimerStep = () => {
    this.setState({
      step: STEPS.INICIO,
      opcionCapturaPendiente: OPCIONES_PESADA_PENDIENTE.CONTINUAR
    })
  }

  mostrarOrdeniaEnProceso = () => {
    this.setState({
      step: STEPS.ORDENIA_EN_PROCESO
    });
  }

  mostrarPanelConfirmacion = () => {
    this.setState({
      step: STEPS.PANEL_CONFIRMACION
    });
  }

  evaluarStep = (step) => {
    if (step === STEPS.CONTINUAR_LISTAR_ANIMALES) {
      this.setState({
        step: STEPS.CONTINUAR_LISTAR_ANIMALES
      })
    } else {
      this.setState({
        step: STEPS.SECADO_EN_PROCESO
      })
    }
  }

  setOpcionCapturaPendienteHandler = (e) => {
    this.setState({
      opcionCapturaPendiente: e.target.value
    });
  }

  listarCapturaHandler = () => {
    console.log('this.props.fechaCaptura', this.props.fechaCaptura);
    this.props.onGenerarCaptura(this.props.loteId, this.props.fechaCaptura, this.continuarListarSecado);
  }

  irACaptura = () => {
    this.alertaHandler(false, CONSTANTES.ALERT_TIPO_MSG.SUCCESS, '');
    this.setState({
      goToCaptura: true
    });
  }

  continuarListarSecado = () => {

    // localStorage.setItem('ubicacionSecadoEncabezado', this.props.loteCaptura);

    this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.SUCCESS, 'Pesada generada satisfactoriamente, redireccionando...');
    setTimeout(() => {
      this.irACaptura()
    }, 1000);
  }

  eliminacionCapturaSatisfactoriaOK = () => {
    this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.SUCCESS, 'Captura eliminada satisfactoriamente.');
    setTimeout(() => {
      window.location.reload()
    }, 300);
  }

  eliminarCaptura = () => {
    this.props.onEliminarSecado(this.props.loteId, this.eliminacionCapturaSatisfactoriaOK);
  }

  eliminarCapturaHandler = () => {
    // 
    this.setState({
      step: STEPS.OPCION_ELIMINAR_CAPTURA
    });
  }

  capturaRepetidaHandler = () => {
    if (this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.CONTINUAR) {
      this.props.onLimpiarFechaCaptura(this.props.fechaEncontrada);
      setTimeout(() => {
        this.irACaptura()
      }, 1000);
    } else {
      if (this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.CANCELAR) {
        this.mostrarPrimerStep();
      } else {
        if (this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.ELIMINAR) {
          this.eliminarCapturaHandler();
        }
      }
    }
  }

  render() {

    let textoButtonCapturaProceso = '';
    let claseButton = 'default';
    let glyfButton = null;

    if (this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.CONTINUAR) {
      textoButtonCapturaProceso = 'Listar';
      claseButton = 'primary';
      glyfButton = "listar";
    } else {
      if (this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.CANCELAR) {
        textoButtonCapturaProceso = 'Cancelar';
        claseButton = 'default';
        glyfButton = "cancelar";
      } else {
        if (this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.ELIMINAR) {
          textoButtonCapturaProceso = 'Eliminar';
          claseButton = 'danger';
          glyfButton = "eliminar";
        }
      }
    }

    let fechaEncontrada = '';
    if (this.props.fechaEncontrada !== '') {
      let fecha = moment(this.props.fechaEncontrada);
      fechaEncontrada = '' + fecha.format("DD/MM/YYYY");
    }

    let btnLimpiar = (
      <Button bsStyle="default" align glyph="limpiar" texto="Limpiar" disabled={this.props.isLoading}
        onClick={() => this.limpiarHandler()} />
    );

    let btnValidar = (
      <Button bsStyle="success" align glyph="siguiente" texto="Validar" disabled={this.props.isLoading}
        onClick={() => this.validar()} />
    );

    if (this.state.salir === true) {
      return <Redirect to={'/'} />
    }

    if (this.state.goToCaptura === true) {
      return <Redirect to={`/secado/captura?loteId=${this.props.loteId}&fechacaptura=${this.props.fechaCaptura}`} />
    }

    return (
      <Aux>
        <div className="container-full">
          <Encabezado
            header="Captura de Secado"
            encabezado={this.state.encabezado}
            funcion={this.salir}
            icon="home"
            textoBoton={null}
          />
          <Loader loading={this.props.isLoading} />
          <div id="divAlert"  >
            <Alerta
              alertaHandler={this.alertaHandler}
              mensaje={this.props.mensaje === null ? '' : this.props.mensaje}
              tipoMensaje={parseInt(this.props.tipoMensaje)}
              visible={this.props.mostrarMensaje}
            />
          </div>

        </div>

        <Container id="divUbicacion" style={{ display: `${this.state.step === STEPS.INICIO ? 'block' : 'none'}` }}>
          <CommonRow />
          <Row>
            <Col xs={12}>
              <Ubicacion
                ranchoEnabled={true}
                isRanchoRequerido={true}
                potreroEnabled={true}
                isPotreroRequerido={true}
                loteEnabled={true}
                isLoteRequerido={true}
                mostrarError={false}

                onExternalRanchoCall={this.onRanchoIdChangeHandler}
                onExternalPotreroCall={this.onPotreroIdChangeHandler}
                onExternalLoteCall={this.onLoteIdChangeHandler}
              />
            </Col>
          </Row>
          <CommonRow />
          <Row id="divFecha">
            <Col xs sm={2}></Col>
            <Col xs sm={4}>
              Fecha:
              <input type="date" style={{ borderRadius: '5px' }}
                value={this.props.fechaCaptura} onChange={this.onFechaCapturaChangeHandler}></input>
            </Col>
            <Col xs sm={4}>
              Semana:
              <input type="text" value={this.props.semanaCaptura === 0 ? '' : this.props.semanaCaptura}
                onChange={null}
                disabled style={{ width: '40px', textAlign: 'center', background: '#fff' }}></input>
            </Col>
            <Col xs sm={2}></Col>
          </Row>
          <CommonRow />
          <Row>
            <Col xs sm={8}>
            </Col>
            <Col xs sm={2}>
              {btnLimpiar}
            </Col>
            <Col xs sm={2}>
              {btnValidar}
            </Col>
          </Row>
        </Container>

        <Container id="divUps" style={{ display: `${this.state.step === STEPS.ORDENIA_EN_PROCESO ? 'block' : 'none'}` }}>
          <CommonRow />
          <CommonRow />
          <SinPesada
            titulo="Captura de ordeña en proceso para esta ubicación."
            textoBody='Finalize o elimine la captura de ordeña antes de proseguir.'
            funcionOk={this.mostrarPrimerStep} />
        </Container>

        <Container id="divConfirmacionListar" style={{ display: `${this.state.step === STEPS.CONTINUAR_LISTAR_ANIMALES && !this.props.isLoading ? 'block' : 'none'}` }}>
          <CommonRow />
          <CommonRow />
          <CommonRow />
          <CommonRow />
          <ConfirmacionCaptura
            mensajeConfirmacion="¿Es correcta esta información para la captura?"
            ubicacion={this.state.ubicacion}
            fechaCaptura={this.props.fechaCaptura}
            onConfirmar={this.listarCapturaHandler}
            onCancelar={this.mostrarPrimerStep}
          />
        </Container>


        <Container id="divCapturaEnProceso" style={{ display: `${this.state.step === STEPS.SECADO_EN_PROCESO && !this.props.isLoading ? 'block' : 'none'}` }}>
          <CommonRow />
          <CommonRow />
          <Row>
            <div className="col-lg-2" ></div>
            <div className="col-lg-8" >
              <Card border="warning">
                <Card.Header>
                  <Card.Title componentClass="h2">Captura encontrada para el lote: {this.props.lote}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-lg-12">
                      <h4>Fecha de captura: {fechaEncontrada}</h4>
                      <br />
                      <h5>Por favor, indique qué desea hacer:</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">

                      <div className="radio">
                        <label>
                          <input type="radio" value="option1" checked={this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.CONTINUAR}
                            value={OPCIONES_PESADA_PENDIENTE.CONTINUAR}
                            onChange={this.setOpcionCapturaPendienteHandler}
                          />
                          <h6 style={{ display: 'inline' }}>&nbsp;Continuar capturando esta pesada</h6>
                        </label>
                      </div>
                      <div className="radio">
                        <label>
                          <input type="radio" value="option2" checked={this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.ELIMINAR}
                            value={OPCIONES_PESADA_PENDIENTE.ELIMINAR}
                            onChange={this.setOpcionCapturaPendienteHandler} />
                          <h6 style={{ display: 'inline' }}>&nbsp;Eliminar esta pesada</h6>
                        </label>
                      </div>
                      <div className="radio">
                        <label>
                          <input type="radio" value="option3" checked={this.state.opcionCapturaPendiente === OPCIONES_PESADA_PENDIENTE.CANCELAR}
                            value={OPCIONES_PESADA_PENDIENTE.CANCELAR}
                            onChange={this.setOpcionCapturaPendienteHandler} />
                          <h6 style={{ display: 'inline' }}>&nbsp;Cancelar</h6>
                        </label>
                      </div>

                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-lg-2" ></div>
          </Row>
          <Row>
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <Button align="right" bsStyle={claseButton} glyph={glyfButton} texto={textoButtonCapturaProceso}
                onClick={() => this.capturaRepetidaHandler()} />
            </div>
            <div className="col-lg-2"></div>
          </Row>
        </Container>


        <div id="divConfirmarEliminarPesada" style={{ display: `${this.state.step === STEPS.OPCION_ELIMINAR_CAPTURA && !this.props.isLoading ? 'block' : 'none'}` }}>
          <CommonRow />
          <CommonRow />
          <ConfirmacionEliminarPesada
            cancelarConfirmacion={this.mostrarPrimerStep}
            procesarEliminacionPesada={this.eliminarCaptura}
          />
        </div>


      </Aux >
    );
  }
}
const mapSateToProps = state => {
  return {
    //  Redux => Ubicacion
    ranchoId: state.ubicacion.ranchoId,
    potreroId: state.ubicacion.potreroId,
    loteId: state.ubicacion.loteId,
    rancho: state.ubicacion.rancho,
    potrero: state.ubicacion.potrero,
    lote: state.ubicacion.lote,

    //  Redux => Secado // MENSAJES
    visible: state.secado.visible,
    mostrarMensaje: state.secado.mostrarMensaje,
    mensaje: state.secado.mensaje,
    tipoMensaje: state.secado.tipoMensaje,
    // ---------
    isLoading: state.secado.loading,
    fechaCaptura: state.secado.fechaCaptura,
    semanaCaptura: state.secado.semanaCaptura,
    loteCaptura: state.secado.loteCaptura,
    fechaEncontrada: state.secado.fechaEncontrada,

  }
}
// The class name will be "sec"
const mapDispatchToProps = dispatch => {
  return {
    onLimpiarUbicacion: () => dispatch(at.limpiarCabeceraUbicacion()),
    onLimpiarFechaCaptura: (valor) => dispatch(sec.setFechaCaptura(valor)),
    onLimpiarSemanaCaptura: (valor) => dispatch(sec.setSemanaCaptura(valor)),

    onMostrarOcultarMensaje: (mostrarMensaje, tipoMensaje, mensaje) => dispatch(sec.mostrarOcultarMensaje(mostrarMensaje, tipoMensaje, mensaje)),

    onSetFechaCaptura: (fechaCaptura) => dispatch(sec.fetchFechaCaptura(fechaCaptura)),
    onSetLoteCaptura: (loteCaptura) => dispatch(sec.setLoteCaptura(loteCaptura)),

    onValidarProcesoSecado: (loteCaptura, fechaCaptura, fnInvalido, fnEvaluarStep) => dispatch(sec.validarProcesoSecado(loteCaptura, fechaCaptura, fnInvalido, fnEvaluarStep)),
    onGenerarCaptura: (loteCaptura, fechaCaptura, fnSuccess) => dispatch(sec.generarCaptura(loteCaptura, fechaCaptura, fnSuccess)),

    onEliminarSecado: (loteCaptura, fnSuccess) => dispatch(sec.eliminarSecado(loteCaptura, fnSuccess)),

  }
}
export default connect(mapSateToProps, mapDispatchToProps)(S01_SecadoContainer);