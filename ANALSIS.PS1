# PAYLOAD FINAL V3.0 - FORENSE BLACK HAT
# Optimizado para: irm n9.cl/shadowiex | iex

 $ErrorActionPreference = "SilentlyContinue"

# Verificación silenciosa
if (-not (Get-Command python -ErrorAction SilentlyContinue)) { 
    Write-Host "[!] CRITICAL: Python not found." -Fore Red; Start-Sleep -s 2; exit 
}
try { python -c "import psutil" 2>$null } catch { 
    Write-Host "[!] Installing psutil..." -Fore Yellow; python -m pip install psutil -q --quiet 
}

 $pyPayload = @"
import tkinter as tk
from tkinter import messagebox, scrolledtext
import os, csv, socket, datetime, threading, psutil, subprocess, re

# --- CONFIG ESTETICA HACKER ---
BG, FG, CYAN, RED = "#050505", "#00FF00", "#00FFFF", "#FF3333"
FONT = ("Consolas", 9)

root = tk.Tk()
root.title("SYSTEM_FORENSE // V.3")
root.geometry("850x600")
root.configure(bg=BG)
root.resizable(False, False)

def log(txt, color=FG):
    t.insert(tk.END, txt + "\n")
    t.tag_config(color, foreground=color)
    t.see(tk.END)
    root.update()

tk.Label(root, text=">>> INITIALIZING FORENSE PROTOCOL <<<", bg=BG, fg=FG, font=("Consolas", 12, "bold")).pack(pady=10)
btn = tk.Button(root, text="[ START SCAN ]", bg="#001a00", fg=FG, font=("Consolas", 10, "bold"), activebackground="#003300", relief="flat")
btn.pack(pady=5)

t = scrolledtext.ScrolledText(root, bg="black", fg=FG, font=FONT, bd=0, insertbackground=FG)
t.pack(fill="both", expand=True, padx=10, pady=10)
status = tk.Label(root, text="STATUS: IDLE", bg=BG, fg="#333", font=("Consolas", 8))
status.pack(side="bottom", fill="x")

def get_dns():
    log("[+] EXTRACTING DNS CACHE...", CYAN)
    try:
        res = subprocess.check_output('ipconfig /displaydns', shell=True).decode('cp850', errors='ignore')
        doms = list(set(re.findall(r"Nombre de registro\s+:\s+(.+)", res)))
        for d in doms[:40]: log(f"    -> {d}")
        return doms
    except: return []

def scan_net():
    log("\n[+] SCANNING NETWORK INTERFACES...", CYAN)
    l, c = [], []
    for conn in psutil.net_connections(kind='inet'):
        try: p = psutil.Process(conn.pid).name()
        except: p = "SYS"
        if conn.status == 'LISTEN' and conn.laddr:
            l.append([p, conn.laddr.port])
            log(f"    [OPEN] {p} : {conn.laddr.port}")
        elif conn.status == 'ESTABLISHED' and conn.raddr and conn.raddr.port not in [80,443,53]:
            c.append([p, f"{conn.raddr.ip}:{conn.raddr.port}"])
            log(f"    [CONN] {p} -> {conn.raddr.ip}:{conn.raddr.port}")
    return l, c

def scan_fs():
    log("\n[+] SCANNING FILESYSTEM (48h)...", CYAN)
    f = []
    umbral = datetime.datetime.now() - datetime.timedelta(hours=48)
    sos = ['.exe','.bat','.ps1','.py','.vbs','.dll','.sh','.js']
    paths = [os.path.expanduser(f"~/{x}") for x in ["Downloads", "Desktop", "Documents", "AppData/Local/Temp"]]
    for r in paths:
        if os.path.exists(r):
            for root, dirs, files in os.walk(r):
                for file in files:
                    try:
                        ts = datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(root, file)))
                        if ts > umbral:
                            ext = os.path.splitext(file)[1].lower()
                            prio = "HIGH" if ext in sos else "MED"
                            f.append([file, ts.strftime("%d/%m %H:%M"), root, prio])
                            if prio == "HIGH": log(f"    [WARN] {file}", RED)
                    except: pass
    return f

def run():
    btn.config(state="disabled", bg="#000")
    status.config(text="STATUS: SCANNING...", fg=RED)
    t.delete(1.0, tk.END)
    log(f"TARGET: {socket.gethostname()} // {datetime.datetime.now()}")
    d = get_dns(); l, c = scan_net(); f = scan_fs()
    log("\n[+] EXPORTING DATA TO CSV...", CYAN)
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    fn = f"FORENSE_RESULT_{ts}.csv"
    with open(fn, "w", newline="", encoding="utf-8-sig") as file:
        w = csv.writer(file)
        w.writerow(["FORENSE REPORT"]); w.writerow([])
        w.writerow("=== DNS HISTORY ==="); w.writerow(["Domain"]); [w.writerow([x]) for x in d]
        w.writerow([]); w.writerow("=== OPEN PORTS ==="); w.writerow(["Proc", "Port"]); [w.writerow(x) for x in l]
        w.writerow([]); w.writerow("=== ACTIVE CONNECTIONS ==="); w.writerow(["Proc", "Dest"]); [w.writerow(x) for x in c]
        w.writerow([]); w.writerow("=== MODIFIED FILES ==="); w.writerow(["File", "Time", "Path", "Prio"]); [w.writerow(x) for x in f]
    log(f"[SUCCESS] FILE SAVED: {fn}", FG)
    os.startfile(fn)
    status.config(text="STATUS: COMPLETED", fg="green")
    messagebox.showinfo("FORENSE", "Scan complete. Report opened.")
    btn.config(state="normal", bg="#001a00")

btn.config(command=lambda: threading.Thread(target=run).start())
root.mainloop()
"@

 $tmpPath = [System.IO.Path]::GetTempFileName() + ".py"
 $pyPayload | Out-File -FilePath $tmpPath -Encoding UTF8
try { & python $tmpPath } finally { if (Test-Path $tmpPath) { Remove-Item $tmpPath -Force } }
