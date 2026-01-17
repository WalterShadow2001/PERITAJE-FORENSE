# PAYLOAD FORENSE PRO V2.0 - OPTIMIZADO PARA IRM | IEX
# Copia y pega esto en PowerShell, o subelo a Gist y usa: irm <url> | iex

 $ErrorActionPreference = "SilentlyContinue"

# 1. Verificación e Instalación Silenciosa de Dependencias
if (-not (Get-Command python -ErrorAction SilentlyContinue)) { Write-Host "[FATAL] Python no encontrado." -Fore Red; exit }
try { python -c "import psutil" 2>$null } catch { python -m pip install psutil -q --quiet }

# 2. Definición del Código Python (Modo Oscuro / Hacker)
 $pyPayload = @"
import tkinter as tk
from tkinter import messagebox, scrolledtext
import os, csv, socket, datetime, threading, psutil, subprocess, re, sys

# Configuración Visual "Terminal"
COLOR_BG, COLOR_FG, COLOR_ALERT = "#000000", "#00FF00", "#00FFFF"
FONT = ("Consolas", 9)

root = tk.Tk()
root.title("FORENSE // SYSTEM_OVERRIDE")
root.geometry("850x600")
root.configure(bg=COLOR_BG)
root.resizable(False, False)

# Función para logs con colores
def log(txt, color=COLOR_FG):
    log_area.insert(tk.END, txt + "\n")
    log_area.tag_config(color, foreground=color)
    log_area.see(tk.END)
    root.update()

# Interfaz
tk.Label(root, text=">>> INICIANDO PROTOCOLO FORENSE <<<", bg=COLOR_BG, fg=COLOR_FG, font=("Consolas", 12, "bold")).pack(pady=10)
btn = tk.Button(root, text="[ EJECUTAR ESCANEO ]", bg="#001100", fg=COLOR_FG, font=("Consolas", 10, "bold"), activebackground="#003300", relief="flat")
btn.pack(pady=5)

log_area = scrolledtext.ScrolledText(root, bg="black", fg=COLOR_FG, font=FONT, bd=0, insertbackground="white")
log_area.pack(fill="both", expand=True, padx=10, pady=10)

status = tk.Label(root, text="ESTADO: ESPERANDO", bg=COLOR_BG, fg="#444", font=("Consolas", 8))
status.pack(side="bottom", fill="x")

def get_dns():
    log("[+] EXTRAYENDO CACHE DNS (HISTORIAL)...", COLOR_ALERT)
    try:
        res = subprocess.check_output('ipconfig /displaydns', shell=True).decode('cp850', errors='ignore')
        doms = list(set(re.findall(r"Nombre de registro\s+:\s+(.+)", res)))
        for d in doms[:50]: log(f"    -> {d}")
        return doms
    except: return []

def scan_net():
    log("\n[+] ESCANEANDO INTERFAZ DE RED...", COLOR_ALERT)
    listeners, conn = [], []
    for c in psutil.net_connections(kind='inet'):
        try:
            p = psutil.Process(c.pid).name()
        except: p = "SYS"
        if c.status == 'LISTEN' and c.laddr:
            listeners.append([p, c.laddr.port])
            log(f"    [OPEN] Port {c.laddr.port} ({p})")
        elif c.status == 'ESTABLISHED' and c.raddr and c.raddr.port not in [80,443,53]:
            conn.append([p, f"{c.raddr.ip}:{c.raddr.port}"])
            log(f"    [CONN] {p} -> {c.raddr.ip}:{c.raddr.port}")
    return listeners, conn

def scan_fs():
    log("\n[+] ESCANEANDO SISTEMA DE ARCHIVOS (48h)...", COLOR_ALERT)
    cambios, umbral, sos = [], datetime.datetime.now() - datetime.timedelta(hours=48), ['.exe','.bat','.ps1','.py','.vbs','.dll','.sh']
    paths = [os.path.expanduser(f"~/{x}") for x in ["Downloads", "Desktop", "Documents", "AppData/Local/Temp"]]
    for r in paths:
        if os.path.exists(r):
            for root, dirs, files in os.walk(r):
                for f in files:
                    try:
                        t = datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(root, f)))
                        if t > umbral:
                            ext = os.path.splitext(f)[1].lower()
                            prio = "ALTA" if ext in sos else "MEDIA"
                            cambios.append([f, t.strftime("%d/%m %H:%M"), root, prio])
                            if prio == "ALTA": log(f"    [FILE] {f} ({prio})", "red")
                    except: pass
    return cambios

def run():
    btn.config(state="disabled", bg="#000000")
    status.config(text="ESTADO: ESCANEANDO", fg="red")
    log_area.delete(1.0, tk.END)
    
    log(f"TARGET: {socket.gethostname()} // {datetime.datetime.now()}")
    d = get_dns()
    l, c = scan_net()
    f = scan_fs()
    
    log("\n[+] GENERANDO REPORTE CSV...", COLOR_ALERT)
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    fn = f"FORENSE_RAW_{ts}.csv"
    
    with open(fn, "w", newline="", encoding="utf-8-sig") as file:
        w = csv.writer(file)
        w.writerow(["REPORTE FORENSE PROFESIONAL"])
        w.writerow([])
        w.writerow("=== HISTORIAL DNS ==="); w.writerow(["Dominio"]); [w.writerow([x]) for x in d]
        w.writerow([]); w.writerow("=== PUERTOS ABIERTOS ==="); w.writerow(["Proc", "Port"]); [w.writerow(x) for x in l]
        w.writerow([]); w.writerow("=== CONEXIONES ==="); w.writerow(["Proc", "Dest"]); [w.writerow(x) for x in c]
        w.writerow([]); w.writerow("=== ARCHIVOS ==="); w.writerow(["Arch", "Fecha", "Ruta", "Prioridad"]); [w.writerow(x) for x in f]
    
    log(f"LISTO: {fn}", "#00FF00")
    os.startfile(fn)
    status.config(text="ESTADO: FINALIZADO", fg="green")
    messagebox.showinfo("FORENSE", "Escaneo completado. Abriendo reporte.")
    btn.config(state="normal", bg="#001100")

btn.config(command=lambda: threading.Thread(target=run).start())
root.mainloop()
"@

# 3. Ejecución en Memoria (Clean Up)
 $tmpPath = [System.IO.Path]::GetTempFileName() + ".py"
 $pyPayload | Out-File -FilePath $tmpPath -Encoding UTF8

try {
    & python $tmpPath
} finally {
    if (Test-Path $tmpPath) { Remove-Item $tmpPath -Force }
}
