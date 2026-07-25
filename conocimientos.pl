% ============================================================
:- dynamic zona/2.
:- dynamic material_muro/2.
:- dynamic techo/2.
:- dynamic almacenamiento_agua/2.
:- dynamic poblacion_vulnerable/2.
:- dynamic techo_protegido/2.

:- dynamic valvula_check/2.
:- dynamic altura_electrica/2.
:- dynamic absorcion_calle/2.
:- dynamic ambiente_hundido/2.
:- dynamic respaldo_energia/2.

:- dynamic proximidad_rio/2.
:- dynamic refugio_alto/2.
:- dynamic dependencia_agropecuaria/2.
:- dynamic suelo_humedad/2.
:- dynamic radio_comunicacion/2.

:- dynamic criaderos_vectores/2.
:- dynamic kit_medico/2.
:- dynamic alimentos_elevados/2.
:- dynamic red_apoyo_vecinal/2.

% REGLAS DE INFERENCIA
% ============================================================

vulnerabilidad_estructural(Id, muy_alta) :-
    material_muro(Id, precario),
    techo(Id, plano),
    techo_protegido(Id, inadecuado), !.

vulnerabilidad_estructural(Id, alta) :-
    material_muro(Id, precario),
    ( techo(Id, plano); techo_protegido(Id, inadecuado) ), !.

vulnerabilidad_estructural(Id, media) :-
    material_muro(Id, precario), !.

vulnerabilidad_estructural(Id, media) :-
    material_muro(Id, noble),
    techo(Id, plano), !.

vulnerabilidad_estructural(Id, baja) :-
    material_muro(Id, noble),
    techo(Id, inclinado).

vulnerabilidad_sanitaria(Id, alta) :-
    zona(Id, urbana),
    valvula_check(Id, no), !.

vulnerabilidad_sanitaria(Id, media) :-
    zona(Id, urbana),
    valvula_check(Id, si), !.

vulnerabilidad_sanitaria(Id, no_aplica) :-
    zona(Id, rural).

riesgo_electrico(Id, alto) :-
    zona(Id, urbana),
    altura_electrica(Id, baja), !.

riesgo_electrico(Id, bajo) :-
    zona(Id, urbana),
    altura_electrica(Id, segura), !.

riesgo_electrico(Id, no_aplica) :-
    zona(Id, rural).

riesgo_hidrologico(Id, muy_alto) :-
    zona(Id, urbana),
    absorcion_calle(Id, mala),
    ambiente_hundido(Id, si), !.

riesgo_hidrologico(Id, alto) :-
    zona(Id, urbana),
    absorcion_calle(Id, mala), !.

riesgo_hidrologico(Id, medio) :-
    zona(Id, urbana),
    ambiente_hundido(Id, si), !.

riesgo_hidrologico(Id, bajo) :-
    zona(Id, urbana),
    absorcion_calle(Id, buena),
    ambiente_hundido(Id, no), !.

riesgo_hidrologico(Id, muy_alto) :-
    zona(Id, rural),
    proximidad_rio(Id, cerca),
    suelo_humedad(Id, retiene), !.

riesgo_hidrologico(Id, alto) :-
    zona(Id, rural),
    proximidad_rio(Id, cerca), !.

riesgo_hidrologico(Id, medio) :-
    zona(Id, rural),
    suelo_humedad(Id, retiene), !.

riesgo_hidrologico(Id, bajo) :-
    zona(Id, rural),
    proximidad_rio(Id, lejos),
    suelo_humedad(Id, drena).

riesgo_epidemiologico(Id, alto) :-
    criaderos_vectores(Id, si),
    almacenamiento_agua(Id, precario), !.

riesgo_epidemiologico(Id, medio) :-
    criaderos_vectores(Id, si), !.

riesgo_epidemiologico(Id, medio) :-
    almacenamiento_agua(Id, precario), !.

riesgo_epidemiologico(Id, bajo) :-
    criaderos_vectores(Id, no),
    almacenamiento_agua(Id, tecnificado).

factor_fragilidad(Id, alta) :-
    poblacion_vulnerable(Id, si).

factor_fragilidad(Id, baja) :-
    poblacion_vulnerable(Id, no).

factor_preparacion(Id, Puntaje) :-
    findall(1, factor_positivo(Id), Positivos),
    length(Positivos, Puntaje).

factor_positivo(Id) :- kit_medico(Id, si).
factor_positivo(Id) :- alimentos_elevados(Id, si).
factor_positivo(Id) :- red_apoyo_vecinal(Id, si).
factor_positivo(Id) :- zona(Id, urbana), respaldo_energia(Id, si).
factor_positivo(Id) :- zona(Id, rural), refugio_alto(Id, si).
factor_positivo(Id) :- zona(Id, rural), radio_comunicacion(Id, si).

capacidad_resiliencia(Id, baja_resiliencia) :-
    factor_fragilidad(Id, alta),
    factor_preparacion(Id, Puntaje),
    Puntaje =< 1, !.

capacidad_resiliencia(Id, media_resiliencia) :-
    factor_preparacion(Id, Puntaje),
    Puntaje >= 2,
    Puntaje =< 3, !.

capacidad_resiliencia(Id, alta_resiliencia) :-
    factor_preparacion(Id, Puntaje),
    Puntaje >= 4.

% CLASIFICACION DE RIESGO GLOBAL
% ============================================================

peso_nivel(muy_alto, 4).
peso_nivel(muy_alta, 4).
peso_nivel(alto, 3).
peso_nivel(alta, 3).
peso_nivel(medio, 2).
peso_nivel(media, 2).
peso_nivel(bajo, 1).
peso_nivel(baja, 1).
peso_nivel(no_aplica, 0).

nivel_riesgo_global(Id, Global) :-
    vulnerabilidad_estructural(Id, VE),
    peso_nivel(VE, PE),
    vulnerabilidad_sanitaria(Id, VS),
    peso_nivel(VS, PS),
    riesgo_electrico(Id, RE),
    peso_nivel(RE, PRE),
    riesgo_hidrologico(Id, RH),
    peso_nivel(RH, PRH),
    riesgo_epidemiologico(Id, REP),
    peso_nivel(REP, PREP),
    Maximo is max(PE, max(PS, max(PRE, max(PRH, PREP)))),
    ( Maximo =:= 4 -> Global = muy_alto
    ; Maximo =:= 3 -> Global = alto
    ; Maximo =:= 2 -> Global = medio
    ; Global = bajo ).

% MOTOR DE RECOMENDACIONES
% ============================================================

recomendacion(rec_estructural_generica, 'Reforzar o sustituir los muros de adobe y corregir la pendiente del techo').
recomendacion(rec_sanitaria_generica, 'Instalar una válvula check antirretorno en la conexión de desagüe').
recomendacion(rec_electrico_generica, 'Elevar tomacorrientes y llave general a una altura segura').
recomendacion(rec_hidrologico_urbano_generica, 'Evitar el uso de ambientes hundidos durante alertas de lluvia y gestionar drenaje temporal').
recomendacion(rec_hidrologico_rural_generica, 'Identificar y ensayar la ruta hacia el refugio alto más cercano ante desborde del río').
recomendacion(rec_epidemiologico_generica, 'Eliminar criaderos de agua estancada y tapar los reservorios de almacenamiento').
recomendacion(rec_resiliencia_generica, 'Reforzar el kit médico familiar, las reservas elevadas de alimentos y coordinar con la junta vecinal').

recomendacion(rec_estructural_techo_plano, 'Para el techo de adobe, instalar calaminas inclinadas para evitar acumulación de agua.').
recomendacion(rec_estructural_proteccion, 'Asegurar correctamente los plásticos con una estructura inclinada y clavada, no solo con peso muerto, para proteger los muros de adobe.').
recomendacion(rec_estructural_loza_plana, 'Revisar los sumideros y la membrana impermeable del techo plano para evitar filtraciones que afecten la estructura de concreto.').

recomendacion(rec_sanitaria_calle_empozada, 'Colocar sacos de arena en la puerta para evitar el ingreso de agua de la calle.').
recomendacion(rec_sanitaria_sotano, 'Elevar todos los equipos y muebles del sótano o ambiente hundido.').

recomendacion(rec_epidemiologica_criaderos, 'Revisar especialmente llantas, botellas y latas descubiertas en el patio.').
recomendacion(rec_epidemiologica_techo_plano, 'Revisar el techo plano, ya que puede acumular agua de lluvia y convertirse en un criadero de mosquitos.').

recomendacion(rec_resiliencia_apoyo, 'Designar a una persona para asistir a niños, ancianos o personas con discapacidad durante la evacuación.').

recomendacion(rec_proteccion_activos, 'Proteger los animales de corral y cultivos, reubicándolos temporalmente en zonas altas o asegurando los corrales ante la crecida del río.').

recomendacion(rec_almacenamiento_agua, 'Mejorar el almacenamiento de agua utilizando recipientes herméticos y elevados para evitar contaminación durante emergencias.').
recomendacion(rec_respaldo_energia, 'Adquirir linternas recargables o lámparas de emergencia para iluminar durante cortes de energía.').
recomendacion(rec_radio_comunicacion, 'Adquirir una radio a pilas (transistor) para recibir alertas y comunicados de emergencia cuando falle la telefonía e internet.').
recomendacion(rec_kit_medico, 'Preparar un botiquín familiar con suero de rehidratación oral y medicamentos para diarrea, ya que las inundaciones aumentan el riesgo de enfermedades gastrointestinales.').
recomendacion(rec_alimentos_elevados, 'Elevar todos los alimentos no perecederos (arroz, azúcar, fideos, conservas) a repisas o estantes altos para protegerlos de inundaciones y humedad.').
recomendacion(rec_refugio_alto_rural, 'Identificar de forma urgente un punto alto cercano (cerro, colegio, iglesia) donde refugiarse en caso de inundación, y coordinar con la comunidad un plan de evacuación.').
recomendacion(rec_suelo_retiene, 'Mejorar el drenaje del terreno (zanjas perimetrales, canales de desvío) para evitar encharcamientos prolongados que debilitan los cimientos y dañan cultivos.').

% CONDICIONES QUE ACTIVAN LAS RECOMENDACIONES
% ============================================================

condicion_recomendacion(Id, rec_estructural_generica) :-
    vulnerabilidad_estructural(Id, Nivel),
    member(Nivel, [alta, muy_alta]).

condicion_recomendacion(Id, rec_sanitaria_generica) :-
    vulnerabilidad_sanitaria(Id, Nivel),
    member(Nivel, [alta]).

condicion_recomendacion(Id, rec_electrico_generica) :-
    riesgo_electrico(Id, alto).

condicion_recomendacion(Id, rec_hidrologico_urbano_generica) :-
    zona(Id, urbana),
    riesgo_hidrologico(Id, Nivel),
    member(Nivel, [alto, muy_alto]).

condicion_recomendacion(Id, rec_hidrologico_rural_generica) :-
    zona(Id, rural),
    riesgo_hidrologico(Id, Nivel),
    member(Nivel, [alto, muy_alto]).

condicion_recomendacion(Id, rec_epidemiologico_generica) :-
    riesgo_epidemiologico(Id, Nivel),
    member(Nivel, [medio, alto]).

condicion_recomendacion(Id, rec_resiliencia_generica) :-
    capacidad_resiliencia(Id, baja_resiliencia).

condicion_recomendacion(Id, rec_estructural_techo_plano) :-
    material_muro(Id, precario),
    techo(Id, plano).

condicion_recomendacion(Id, rec_estructural_proteccion) :-
    material_muro(Id, precario),
    techo_protegido(Id, inadecuado).

condicion_recomendacion(Id, rec_estructural_loza_plana) :-
    material_muro(Id, noble),
    techo(Id, plano).

condicion_recomendacion(Id, rec_sanitaria_calle_empozada) :-
    zona(Id, urbana),
    valvula_check(Id, no),
    absorcion_calle(Id, mala).

condicion_recomendacion(Id, rec_sanitaria_sotano) :-
    zona(Id, urbana),
    valvula_check(Id, no),
    ambiente_hundido(Id, si).

condicion_recomendacion(Id, rec_epidemiologica_criaderos) :-
    criaderos_vectores(Id, si),
    almacenamiento_agua(Id, precario).

condicion_recomendacion(Id, rec_epidemiologica_techo_plano) :-
    criaderos_vectores(Id, si),
    techo(Id, plano).

condicion_recomendacion(Id, rec_resiliencia_apoyo) :-
    poblacion_vulnerable(Id, si),
    red_apoyo_vecinal(Id, no).

condicion_recomendacion(Id, rec_proteccion_activos) :-
    zona(Id, rural),
    dependencia_agropecuaria(Id, si).

condicion_recomendacion(Id, rec_almacenamiento_agua) :-
    almacenamiento_agua(Id, precario).

condicion_recomendacion(Id, rec_respaldo_energia) :-
    zona(Id, urbana),
    respaldo_energia(Id, no).

condicion_recomendacion(Id, rec_radio_comunicacion) :-
    zona(Id, rural),
    radio_comunicacion(Id, no).

condicion_recomendacion(Id, rec_kit_medico) :-
    kit_medico(Id, no).

condicion_recomendacion(Id, rec_alimentos_elevados) :-
    alimentos_elevados(Id, no).

condicion_recomendacion(Id, rec_refugio_alto_rural) :-
    zona(Id, rural),
    refugio_alto(Id, no).

condicion_recomendacion(Id, rec_suelo_retiene) :-
    zona(Id, rural),
    suelo_humedad(Id, retiene).

recomendar(Id, Lista) :-
    findall(Texto,
            (condicion_recomendacion(Id, RecID), recomendacion(RecID, Texto)),
            Lista).
