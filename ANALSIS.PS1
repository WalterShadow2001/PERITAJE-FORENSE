# PAYLOAD FORENSE UNIVERSAL V4.0 - ESTILO EXCEL PROFESIONAL
# Requiere Microsoft Excel instalado para los colores. Si no hay Excel, genera CSV simple.

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

 $ErrorActionPreference = "SilentlyContinue"

# --- INTERFAZ GRÁFICA (MODO OSCURO) ---
 $form = New-Object System.Windows.Forms.Form
 $form.Text = "SYSTEM_FORENSE // REPORTER V4"
 $form.Size = New-Object System.Drawing.Size(850, 600)
 $form.BackColor = [System.Drawing.Color]::FromArgb(5, 5, 5)
 $form.StartPosition = "CenterScreen"
 $form.FormBorderStyle = "FixedDialog"
 $form.MaximizeBox = $false

 $btnScan = New-Object System.Windows.Forms.Button
 $btnScan.Text = "[ GENERAR REPORTE EXCEL ]"
 $btnScan.BackColor = [System.Drawing.Color]::FromArgb(0, 30, 0)
 $btnScan.ForeColor = [System.Drawing.Color]::Lime
 $btnScan.Font = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Bold)
 $btnScan.Size = New-Object System.Drawing.Size(280, 40)
 $btnScan.Location = New-Object System.Drawing.Point(285, 20)

 $txtLog = New-Object System.Windows.Forms.RichTextBox
 $txtLog.Location = New-Object System.Drawing.Point(20, 80)
 $txtLog.Size = New-Object System.Drawing.Size(800, 450)
 $txtLog.BackColor = [System.Drawing.Color]::Black
 $txtLog.ForeColor = [System.Drawing.Color]::Lime
 $txtLog.Font = New-Object System.Drawing.Font("Consolas", 9)
 $txtLog.ReadOnly = $true
 $txtLog.BorderStyle = "None"

 $status = New-Object System.Windows.Forms.Label
 $status.Text = "ESTADO: LISTO PARA ANALIZAR"
 $status.ForeColor = [System.Drawing.Color]::Gray
 $status.BackColor = [System.Drawing.Color]::Black
 $status.Location = New-Object System.Drawing.Point(20, 540)
 $status.Size = New-Object System.Drawing.Size(800, 20)
 $status.Font = New-Object System.Drawing.Font("Consolas", 8)

 $form.Controls.Add($btnScan)
 $form.Controls.Add($txtLog)
 $form.Controls.Add($status)

function Write-Log {
    param($Text, $Color = "Lime")
    $txtLog.AppendText("`r`n$Text")
    $txtLog.Select($txtLog.TextLength - $Text.Length, $Text.Length)
    $txtLog.SelectionColor = $Color
    $txtLog.ScrollToCaret()
    $form.Refresh()
}

# --- RECOLECCION DE DATOS ---
function Get-Data {
    $dns = try { Get-DnsClientCache | Select-Object -ExpandProperty Entry -Unique | Select-Object -First 50 } catch { @("No disponible") }
    $conns = try { Get-NetTCPConnection | Where-Object { $_.State -eq 'Established' -and $_.RemotePort -notin @(80, 443, 53) } } catch { @() }
    
    $files = @()
    $limit = (Get-Date).AddHours(-48)
    $sos = @('.exe', '.bat', '.ps1', '.vbs', '.sh', '.js', '.dll')
    $paths = @("$env:USERPROFILE\Downloads", "$env:USERPROFILE\Desktop", "$env:USERPROFILE\Documents", "$env:TEMP")

    foreach ($p in $paths) {
        if (Test-Path $p) {
            Get-ChildItem -Path $p -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt $limit } | ForEach-Object {
                $ext = $_.Extension.ToLower()
                $prio = if ($sos -contains $ext) { "ALTA" } else { "MEDIA" }
                $files += [PSCustomObject]@{
                    Nombre = $_.Name
                    Fecha = $_.LastWriteTime.ToString("dd/MM/yyyy HH:mm")
                    Ruta = $_.DirectoryName
                    Prioridad = $prio
                }
            }
        }
    }
    return $dns, $conns, $files
}

# --- GENERADOR DE EXCEL ESTILIZADO ---
function Export-ExcelStyled {
    param($DNS, $Conns, $Files, $Path)

    try {
        Write-Log ">>> INICIALIZANDO MOTOR EXCEL..." "Cyan"
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $workbook = $excel.Workbooks.Add()
        $sheet = $workbook.ActiveSheet
        $row = 1

        # --- AYUDAS DE ESTILO ---
        $Grey = 15790320 # RGB(240,240,240)
        $Red = 255       # Rojo Intenso
        $White = 16777215

        function Set-Cell($r, $c, $val, $Bold=$false, $BgColor=$null, $FgColor=$null) {
            $cell = $sheet.Cells.Item($row, $c)
            $cell.Value2 = $val
            $cell.Font.Bold = $Bold
            if ($BgColor) { $cell.Interior.Color = $BgColor }
            if ($FgColor) { $cell.Font.Color = $FgColor }
        }

        # --- SECCION 1: HISTORIAL DNS ---
        Set-Cell $row 1 "REPORTE FORENSE DIGITAL" $true
        $sheet.Cells.Item($row, 1).Font.Size = 16
        $row++; $row++

        Set-Cell $row 1 "HISTORIAL DNS (CACHE)" $true $Grey
        $row++
        foreach ($d in $DNS) {
            Set-Cell $row 1 $d
            $row++
        }
        $row++

        # --- SECCION 2: CONEXIONES ---
        Set-Cell $row 1 "CONEXIONES ACTIVAS SOSPECHOSAS" $true $Grey
        $row++
        Set-Cell $row 1 "Proceso"; Set-Cell $row 2 "Puerto"; Set-Cell $row 3 "Destino"
        $row++
        foreach ($c in $Conns) {
            $pName = try { (Get-Process -Id $c.OwningProcess -ErrorAction Stop).ProcessName } catch { "Desconocido" }
            Set-Cell $row 1 $pName
            Set-Cell $row 2 $c.LocalPort
            Set-Cell $row 3 "$($c.RemoteAddress):$($c.RemotePort)"
            $row++
        }
        $row++

        # --- SECCION 3: ARCHIVOS ---
        Set-Cell $row 1 "ARCHIVOS MODIFICADOS (48H)" $true $Grey
        $row++
        Set-Cell $row 1 "Nombre"; Set-Cell $row 2 "Fecha"; Set-Cell $row 3 "Ruta"; Set-Cell $row 4 "Prioridad"
        $row++
        
        foreach ($f in $Files) {
            if ($f.Prioridad -eq "ALTA") {
                Set-Cell $row 1 $f.Nombre -BgColor $Red -FgColor $White
                Set-Cell $row 2 $f.Fecha -BgColor $Red -FgColor $White
                Set-Cell $row 3 $f.Ruta -BgColor $Red -FgColor $White
                Set-Cell $row 4 $f.Prioridad -BgColor $Red -FgColor $White
            } else {
                Set-Cell $row 1 $f.Nombre
                Set-Cell $row 2 $f.Fecha
                Set-Cell $row 3 $f.Ruta
                Set-Cell $row 4 $f.Prioridad
            }
            $row++
        }

        # --- AJUSTES FINALES Y GUARDADO ---
        Write-Log ">>> APLICANDO FORMATO Y GUARDANDO..." "Cyan"
        
        # Auto-Ajustar columnas
        $range = $sheet.UsedRange
        $range.EntireColumn.AutoFit() | Out-Null
        
        # Poner bordes simples
        $range.Borders.LineStyle = 1 # xlContinuous
        
        # Guardar y cerrar
        $workbook.SaveAs($Path)
        $workbook.Close($false)
        $excel.Quit()
        
        # Limpieza de memoria COM
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
        [GC]::Collect()
        [GC]::WaitForPendingFinalizers()

        return $true
    } catch {
        Write-Log "ERROR: Excel no encontrado o bloqueado. Generando CSV simple..." "Red"
        return $false
    }
}

# --- ACCION DEL BOTON ---
 $btnScan.Add_Click({
    $btnScan.Enabled = $false
    $txtLog.Clear()
    $status.ForeColor = "Red"
    
    Write-Log "========================================" "White"
    Write-Log ">>> INICIANDO INVESTIGACION FORENSE <<<" "White"
    Write-Log "OBJETIVO: $env:COMPUTERNAME"
    Write-Log "========================================" "White"
    
    $dns, $conns, $files = Get-Data
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $outFile = "$HOME\Desktop\REPORTE_FORENSE_$timestamp.xlsx"

    Write-Log "`n[+] PROCESANDO INFORMACIÓN..." "Cyan"
    $success = Export-ExcelStyled -DNS $dns -Conns $conns -Files $files -Path $outFile

    if (-not $success) {
        # Fallback CSV si falla Excel
        Write-Log "[+] GENERANDO FALLBACK (CSV)..." "Yellow"
        $csvPath = "$HOME\Desktop\REPORTE_FORENSE_$timestamp.csv"
        $files | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
        Invoke-Item $csvPath
        Write-Log "CSV GENERADO: $csvPath" "White"
    } else {
        Invoke-Item $outFile
        Write-Log "`n[+] REPORTE EXCEL GENERADO CON EXITO." "Green"
    }

    $status.ForeColor = "Green"
    $status.Text = "ESTADO: COMPLETADO"
    $btnScan.Enabled = $true
    [System.Windows.Forms.MessageBox]::Show("El reporte se ha generado y abierto.", "FORENSE V4")
})

[void]$form.ShowDialog()
