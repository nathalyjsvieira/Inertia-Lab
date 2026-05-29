const G_TO_MS2 = 9.80665;

function processarDadosVibracao(leituras, amostragemHz) {
  const zeroStr = "0.00";
  const defaults = { comp: zeroStr, x: zeroStr, y: zeroStr, z: zeroStr };
  
  if (!leituras || leituras.length === 0) {
    return { velocidadeRMS: defaults, aceleracaoPico: defaults, deslocamentoPP: defaults, grafico: [] };
  }

  const N = leituras.length;
  const dt = 1 / amostragemHz;

  let somaX = 0, somaY = 0, somaZ = 0;
  let dadosBrutos = leituras.map(l => {
    somaX += l.Eixo_X; somaY += l.Eixo_Y; somaZ += l.Eixo_Z;
    return { t: l.Timestamp_Leitura, x: l.Eixo_X * G_TO_MS2, y: l.Eixo_Y * G_TO_MS2, z: l.Eixo_Z * G_TO_MS2 };
  });

  const mediaX = somaX / N * G_TO_MS2;
  const mediaY = somaY / N * G_TO_MS2;
  const mediaZ = somaZ / N * G_TO_MS2;

  let maxPico = { comp: 0, x: 0, y: 0, z: 0 };
  let arraysAcc = { comp: [], x: [], y: [], z: [] };

  dadosBrutos.forEach(p => {
    const ax = p.x - mediaX, ay = p.y - mediaY, az = p.z - mediaZ;
    const aComp = Math.sqrt(ax*ax + ay*ay + az*az);
    
    arraysAcc.x.push(ax); arraysAcc.y.push(ay); arraysAcc.z.push(az); arraysAcc.comp.push(aComp);

    if (Math.abs(ax) / G_TO_MS2 > maxPico.x) maxPico.x = Math.abs(ax) / G_TO_MS2;
    if (Math.abs(ay) / G_TO_MS2 > maxPico.y) maxPico.y = Math.abs(ay) / G_TO_MS2;
    if (Math.abs(az) / G_TO_MS2 > maxPico.z) maxPico.z = Math.abs(az) / G_TO_MS2;
    if (aComp / G_TO_MS2 > maxPico.comp) maxPico.comp = aComp / G_TO_MS2;
  });

  const calcIntegral = (arrayAcc) => {
    let vel = new Array(N).fill(0), desl = new Array(N).fill(0), somaQuadVel = 0;
    for (let i = 1; i < N; i++) {
      vel[i] = vel[i - 1] + ((arrayAcc[i] + arrayAcc[i - 1]) / 2) * dt;
      somaQuadVel += Math.pow(vel[i] * 1000, 2); // mm/s
    }
    const rms = Math.sqrt(somaQuadVel / N);
    
    for (let i = 1; i < N; i++) desl[i] = desl[i - 1] + ((vel[i] + vel[i - 1]) / 2) * dt;
    const mediaDesl = desl.reduce((a, b) => a + b, 0) / N;
    const deslFiltrado = desl.map(d => (d - mediaDesl) * 1000000); // µm
    const pp = Math.max(...deslFiltrado) - Math.min(...deslFiltrado);
    
    return { rms, pp };
  };

  const intX = calcIntegral(arraysAcc.x), intY = calcIntegral(arraysAcc.y), intZ = calcIntegral(arraysAcc.z), intComp = calcIntegral(arraysAcc.comp);

  return {
    aceleracaoPico: { comp: maxPico.comp.toFixed(2), x: maxPico.x.toFixed(2), y: maxPico.y.toFixed(2), z: maxPico.z.toFixed(2) },
    velocidadeRMS: { comp: intComp.rms.toFixed(2), x: intX.rms.toFixed(2), y: intY.rms.toFixed(2), z: intZ.rms.toFixed(2) },
    deslocamentoPP: { comp: intComp.pp.toFixed(2), x: intX.pp.toFixed(2), y: intY.pp.toFixed(2), z: intZ.pp.toFixed(2) },
    grafico: leituras.map((l, i) => ({ timestamp: l.Timestamp_Leitura, x: l.Eixo_X, y: l.Eixo_Y, z: l.Eixo_Z, comp: arraysAcc.comp[i] / G_TO_MS2 }))
  };
}

module.exports = { processarDadosVibracao };