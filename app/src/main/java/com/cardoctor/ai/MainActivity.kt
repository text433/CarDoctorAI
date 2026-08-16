package com.cardoctor.ai

import android.app.Activity
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.text.InputType
import android.view.Gravity
import android.view.View
import android.widget.*
import android.graphics.drawable.GradientDrawable

class MainActivity : Activity() {

    private lateinit var makeInput: EditText
    private lateinit var modelInput: EditText
    private lateinit var yearInput: EditText
    private lateinit var engineInput: EditText
    private lateinit var obdInput: EditText
    private lateinit var symptomInput: EditText
    private lateinit var resultBox: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildScreen())
    }

    private fun buildScreen(): View {
        val scroll = ScrollView(this)
        scroll.setBackgroundColor(Color.rgb(17, 24, 39))

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(20), dp(18), dp(28))
        }

        scroll.addView(root)

        root.addView(TextView(this).apply {
            text = "CarDoctor AI"
            textSize = 28f
            setTextColor(Color.WHITE)
            setTypeface(typeface, Typeface.BOLD)
        })

        root.addView(TextView(this).apply {
            text = "Auto diagnostikas asistents"
            textSize = 15f
            setTextColor(Color.rgb(156, 163, 175))
            setPadding(0, dp(2), 0, dp(18))
        })

        root.addView(sectionTitle("Auto dati"))

        makeInput = input("Marka, piem. Audi")
        modelInput = input("Modelis, piem. A8 D3")
        yearInput = input(
            "Gads, piem. 2008",
            InputType.TYPE_CLASS_NUMBER
        )
        engineInput = input("Motors, piem. 3.0 TDI ASB")

        root.addView(makeInput)
        root.addView(modelInput)
        root.addView(yearInput)
        root.addView(engineInput)

        root.addView(sectionTitle("Diagnostika"))

        obdInput = input("OBD kods, piem. P0401")

        symptomInput = input(
            "Apraksti simptomu, piem. auksts slikti lec un kratās"
        ).apply {
            minLines = 4
            gravity = Gravity.TOP
        }

        root.addView(obdInput)
        root.addView(symptomInput)

        val diagnoseButton = Button(this).apply {
            text = "DIAGNOSTICĒT"
            textSize = 16f
            setTextColor(Color.WHITE)
            background = rounded(
                Color.rgb(34, 197, 94),
                14f
            )
            setPadding(
                dp(12),
                dp(14),
                dp(12),
                dp(14)
            )
            setOnClickListener {
                diagnose()
            }
        }

        val buttonParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )

        buttonParams.setMargins(
            0,
            dp(10),
            0,
            dp(18)
        )

        root.addView(
            diagnoseButton,
            buttonParams
        )

        resultBox = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(
                dp(16),
                dp(16),
                dp(16),
                dp(16)
            )
            background = rounded(
                Color.rgb(31, 41, 55),
                16f
            )
            visibility = View.GONE
        }

        root.addView(resultBox)

        return scroll
    }

    private fun diagnose() {
        val make = makeInput.text.toString().trim()
        val model = modelInput.text.toString().trim()
        val year = yearInput.text.toString().trim()
        val engine = engineInput.text.toString().trim()

        val obd = obdInput.text
            .toString()
            .trim()
            .uppercase()

        val symptom = symptomInput.text
            .toString()
            .trim()
            .lowercase()

        if (obd.isBlank() && symptom.isBlank()) {
            Toast.makeText(
                this,
                "Ievadi simptomu vai OBD kodu.",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        val vehicle = listOf(
            make,
            model,
            year,
            engine
        )
            .filter { it.isNotBlank() }
            .joinToString(" ")

        val findings = mutableListOf<String>()

        var risk = "VIDĒJS"
        var riskColor = Color.rgb(245, 158, 11)

        val obdMap = mapOf(
            "P0401" to
                "EGR plūsma ir nepietiekama. Pārbaudi EGR vārstu, kanālus un MAF.",

            "P0299" to
                "Turbīnas spiediens par zemu. Pārbaudi intercooler trubas, vakuumu un turbīnu.",

            "P0234" to
                "Turbīnas pārspiediens. Pārbaudi VNT mehānismu un vakuuma vadību.",

            "P0101" to
                "MAF sensora rādījumi ārpus diapazona. Pārbaudi MAF un gaisa noplūdes.",

            "P0087" to
                "Degvielas rail spiediens par zemu. Pārbaudi filtru, sūkņus un sprauslu atplūdi.",

            "P0300" to
                "Vairāku cilindru aizdedzes kļūdas. Pārbaudi sprauslas, kompresiju un degvielu.",

            "P2002" to
                "DPF efektivitāte zem normas. Pārbaudi DPF piesātinājumu un sensorus."
        )

        if (obd.isNotBlank()) {
            findings += "OBD $obd: " +
                (obdMap[obd]
                    ?: "Šis kods vēl nav lokālajā datubāzē.")
        }

        if (
            symptom.contains("slikti lec") ||
            symptom.contains("nelec") ||
            symptom.contains("grūti lec")
        ) {
            findings +=
                "Grūta iedarbināšana: pārbaudi akumulatoru, starteri, degvielas spiedienu, kvēlsveces un sprauslas."
        }

        if (
            symptom.contains("aukst") &&
            (
                symptom.contains("krat") ||
                symptom.contains("dreb")
            )
        ) {
            findings +=
                "Auksta motora kratīšanās: iespējamas kvēlsveces, sprauslas, kompresija vai degvielas padeve."
        }

        if (symptom.contains("svilp")) {
            findings +=
                "Svilpšana paātrinoties: pārbaudi boost un intercooler trubas uz plaisām vai noplūdēm."
        }

        if (
            symptom.contains("dūm") ||
            symptom.contains("dumo")
        ) {
            findings +=
                "Dūmošana: melni dūmi biežāk saistīti ar gaisu/EGR/boost, zili ar eļļu, balti ar degvielu vai dzesēšanas šķidrumu."
        }

        if (
            symptom.contains("eļļ") &&
            symptom.contains("spied")
        ) {
            risk = "AUGSTS"
            riskColor = Color.rgb(239, 68, 68)

            findings +=
                "Eļļas spiediena problēma var būt kritiska. Motoru nevajadzētu ilgstoši darbināt pirms pārbaudes."
        }

        if (
            symptom.contains("pārkar") ||
            symptom.contains("temperatūr")
        ) {
            risk = "AUGSTS"
            riskColor = Color.rgb(239, 68, 68)

            findings +=
                "Pārkaršana var izraisīt smagus motora bojājumus. Pārbaudi dzesēšanas sistēmu."
        }

        if (findings.isEmpty()) {
            findings +=
                "Nepietiek datu drošam secinājumam. Ieteicams nolasīt OBD kļūdas un live data."
        }

        resultBox.removeAllViews()
        resultBox.visibility = View.VISIBLE

        resultBox.addView(
            TextView(this).apply {
                text =
                    if (vehicle.isBlank())
                        "DIAGNOSTIKAS REZULTĀTS"
                    else
                        "DIAGNOSTIKA • $vehicle"

                setTextColor(Color.WHITE)
                textSize = 17f
                setTypeface(typeface, Typeface.BOLD)
            }
        )

        resultBox.addView(
            TextView(this).apply {
                text = "Riska līmenis: $risk"
                setTextColor(riskColor)
                textSize = 16f
                setTypeface(typeface, Typeface.BOLD)
                setPadding(
                    0,
                    dp(10),
                    0,
                    dp(8)
                )
            }
        )

        findings.forEachIndexed { index, finding ->

            resultBox.addView(
                TextView(this).apply {
                    text = "${index + 1}. $finding"
                    setTextColor(
                        Color.rgb(229, 231, 235)
                    )
                    textSize = 14f
                    setPadding(
                        0,
                        dp(5),
                        0,
                        dp(5)
                    )
                }
            )
        }

        resultBox.addView(
            TextView(this).apply {
                text =
                    "\nIeteicamā secība: kļūdu kodi → live data → vizuāla pārbaude → tikai tad detaļu maiņa."

                setTextColor(
                    Color.rgb(147, 197, 253)
                )
                textSize = 13f
            }
        )
    }

    private fun sectionTitle(
        value: String
    ): TextView {

        return TextView(this).apply {
            text = value
            setTextColor(
                Color.rgb(209, 213, 219)
            )
            textSize = 14f
            setTypeface(
                typeface,
                Typeface.BOLD
            )
            setPadding(
                0,
                dp(12),
                0,
                dp(7)
            )
        }
    }

    private fun input(
        hintValue: String,
        type: Int = InputType.TYPE_CLASS_TEXT
    ): EditText {

        return EditText(this).apply {
            hint = hintValue
            inputType = type
            setTextColor(Color.WHITE)
            setHintTextColor(
                Color.rgb(107, 114, 128)
            )
            textSize = 15f
            setPadding(
                dp(14),
                dp(12),
                dp(14),
                dp(12)
            )
            background = rounded(
                Color.rgb(31, 41, 55),
                12f
            )

            layoutParams =
                LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(
                        0,
                        0,
                        0,
                        dp(9)
                    )
                }
        }
    }

    private fun rounded(
        color: Int,
        radius: Float
    ): GradientDrawable {

        return GradientDrawable().apply {
            setColor(color)
            cornerRadius = dp(radius.toInt()).toFloat()
        }
    }

    private fun dp(value: Int): Int {
        return (
            value *
            resources.displayMetrics.density
        ).toInt()
    }
}
