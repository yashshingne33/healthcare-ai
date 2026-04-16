from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime

PURPLE = colors.HexColor('#6366f1')
GREEN  = colors.HexColor('#10b981')
AMBER  = colors.HexColor('#f59e0b')
RED    = colors.HexColor('#ef4444')
DARK   = colors.HexColor('#1a1f3a')
LIGHT  = colors.HexColor('#f0f4ff')
GRAY   = colors.HexColor('#6b7280')


def get_risk_color(risk_level: str):
    return RED if risk_level == 'HIGH' else AMBER if risk_level == 'MEDIUM' else GREEN


def generate_pdf_report(
    user_name:    str,
    user_email:   str,
    disease:      str,
    result_label: str,
    probability:  float,
    confidence_low:  float,
    confidence_high: float,
    risk_level:   str,
    top_factors:  list,
    health_tips:  list,
    input_data:   dict,
) -> bytes:

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    story  = []

    # ── Header ───────────────────────────────────────────
    header_data = [[
        Paragraph("<font color='#ffffff' size='18'><b>HealthAI</b></font><br/><br/>"
                "<font color='#a5b4fc' size='10'>Patient Risk Assessment Report</font>", styles['Normal']),
        Paragraph(f"<font color='#ffffff' size='9'>Generated:<br/>{datetime.now().strftime('%d %B %Y, %H:%M')}</font>",
                ParagraphStyle('right', alignment=1, fontSize=9))
    ]]
    header_table = Table(header_data, colWidths=[13*cm, 4*cm])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK),
        ('TOPPADDING',    (0,0), (-1,-1), 20),
        ('BOTTOMPADDING', (0,0), (-1,-1), 20),
        ('LEFTPADDING',   (0,0), (-1,-1), 20),
        ('RIGHTPADDING',  (0,0), (-1,-1), 20),
        ('VALIGN',     (0,0), (-1,-1), 'MIDDLE'),
    ]))

    story.append(header_table)
    story.append(Spacer(1, 0.5*cm))

    # ── Patient info ─────────────────────────────────────
    info_style = ParagraphStyle('info', fontSize=10, leading=18)
    risk_color = get_risk_color(risk_level)
    pct = round(probability * 100)
    ci_low_pct  = round(confidence_low * 100)
    ci_high_pct = round(confidence_high * 100)

    info_data = [
        ['Patient Name',  user_name],
        ['Email',         user_email],
        ['Disease Assessed', disease.title()],
        ['Prediction Result', result_label],
        ['Risk Level',    risk_level],
        ['Probability',   f'{pct}%  (Confidence Interval: {ci_low_pct}% – {ci_high_pct}%)'],
        ['Report Date',   datetime.now().strftime('%d %B %Y')],
    ]

    info_table = Table(info_data, colWidths=[5*cm, 12*cm])
    info_table.setStyle(TableStyle([
        ('FONTNAME',    (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTSIZE',    (0,0), (-1,-1), 10),
        ('TEXTCOLOR',   (0,0), (0,-1), DARK),
        ('TEXTCOLOR',   (1,0), (1,-1), GRAY),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [colors.white, colors.HexColor('#f9fafb')]),
        ('PADDING',     (0,0), (-1,-1), 8),
        ('GRID',        (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
        ('TEXTCOLOR',   (1,4), (1,4), risk_color),
        ('FONTNAME',    (1,4), (1,4), 'Helvetica-Bold'),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 0.5*cm))

    # ── Risk meter bar ────────────────────────────────────
    story.append(Paragraph("<b>Risk Probability Meter</b>",
        ParagraphStyle('section', fontSize=12, textColor=DARK, spaceAfter=8)))

    filled = int(pct / 5)   # 20 blocks total
    empty  = 20 - filled
    bar    = '█' * filled + '░' * empty
    bar_color = '#ef4444' if risk_level == 'HIGH' else '#f59e0b' if risk_level == 'MEDIUM' else '#10b981'

    story.append(Paragraph(
        f"<font name='Courier' size='11' color='{bar_color}'>{bar}</font>  "
        f"<b><font color='{bar_color}'>{pct}%</font></b>  "
        f"<font color='#9ca3af' size='9'>({risk_level} RISK)</font>",
        ParagraphStyle('bar', fontSize=11, leading=20)
    ))
    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e5e7eb')))
    story.append(Spacer(1, 0.3*cm))

    # ── Top risk factors ──────────────────────────────────
    story.append(Paragraph("<b>Top Risk Factors (AI Explanation)</b>",
        ParagraphStyle('section', fontSize=12, textColor=DARK, spaceAfter=8)))

    impact_labels = ['High Impact', 'Medium Impact', 'Low Impact']
    bar_widths    = [85, 55, 35]
    factor_colors = ['#6366f1', '#10b981', '#f59e0b']

    for i, factor in enumerate(top_factors[:3]):
        filled_f = int(bar_widths[i] / 5)
        empty_f  = 20 - filled_f
        bar_f    = '█' * filled_f + '░' * empty_f
        story.append(Paragraph(
            f"<b>{i+1}. {factor}</b> — {impact_labels[i]}<br/>"
            f"<font name='Courier' size='10' color='{factor_colors[i]}'>{bar_f}</font>",
            ParagraphStyle('factor', fontSize=10, leading=18, spaceAfter=6)
        ))

    story.append(Spacer(1, 0.3*cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e5e7eb')))
    story.append(Spacer(1, 0.3*cm))

    # ── Health recommendations ────────────────────────────
    story.append(Paragraph("<b>Health Recommendations</b>",
        ParagraphStyle('section', fontSize=12, textColor=DARK, spaceAfter=8)))

    for tip in health_tips:
        story.append(Paragraph(
            f"<font color='#10b981'>•</font>  {tip}",
            ParagraphStyle('tip', fontSize=10, leading=18, leftIndent=10, spaceAfter=4)
        ))

    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e5e7eb')))
    story.append(Spacer(1, 0.3*cm))

    # ── Input data table ──────────────────────────────────
    story.append(Paragraph("<b>Patient Input Data</b>",
        ParagraphStyle('section', fontSize=12, textColor=DARK, spaceAfter=8)))

    input_rows = [['Parameter', 'Value']]
    for k, v in input_data.items():
        input_rows.append([k.replace('_', ' ').title(), str(round(v, 3) if isinstance(v, float) else v)])

    input_table = Table(input_rows, colWidths=[8*cm, 9*cm])
    input_table.setStyle(TableStyle([
        ('BACKGROUND',  (0,0), (-1,0), PURPLE),
        ('TEXTCOLOR',   (0,0), (-1,0), colors.white),
        ('FONTNAME',    (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE',    (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f9fafb')]),
        ('GRID',        (0,0), (-1,-1), 0.3, colors.HexColor('#e5e7eb')),
        ('PADDING',     (0,0), (-1,-1), 6),
    ]))
    story.append(input_table)
    story.append(Spacer(1, 0.5*cm))

    # ── Footer ────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#e5e7eb')))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(
        "<font color='#9ca3af' size='8'>"
        "This report is generated by HealthAI and is intended for informational purposes only. "
        "It is not a substitute for professional medical advice, diagnosis, or treatment. "
        "Always consult a qualified healthcare provider."
        "</font>",
        ParagraphStyle('footer', fontSize=8, textColor=GRAY, alignment=TA_CENTER)
    ))

    doc.build(story)
    return buffer.getvalue()