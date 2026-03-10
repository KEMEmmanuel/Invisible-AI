const { exec } = require('child_process');
const path = require('path');

/**
 * Windows SAPI Text-to-Speech (TTS) via PowerShell
 */
function speak(text) {
  if (process.platform !== 'win32') {
    console.warn('SAPI is only available on Windows.');
    return;
  }

  // PowerShell command to use SAPI.SpVoice
  const command = `powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${text.replace(/'/g, "''")}')"`;

  exec(command, (error) => {
    if (error) {
      console.error(`SAPI Speech Error: ${error.message}`);
    }
  });
}

/**
 * Windows SAPI Voice Recognition (STT) via PowerShell (Basic Mock/Implementation)
 * Note: Real-time continuous STT via SAPI is complex in PowerShell,
 * but we can use simple voice commands or trigger the Windows Speech Recognition UI.
 */
function startSapiRecognition(callback) {
  if (process.platform !== 'win32') {
    console.warn('SAPI is only available on Windows.');
    return;
  }

  // This is a placeholder for a more robust C# or PowerShell based transceiver.
  // For now, it logs activity. In production, we'd use a custom .NET helper.
  console.log('SAPI Recognition Started');
}

module.exports = { speak, startSapiRecognition };
