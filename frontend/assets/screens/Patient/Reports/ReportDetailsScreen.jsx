import React, { useRef } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { captureRef } from "react-native-view-shot";
import styles from "../../../styles";

export default function ReportDetailsScreen({ route }) {
  const { record } = route.params;
  const chartRef = useRef();

  const handleShare = async () => {
    try {
      const chartImage = await generateChartImage();
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #E7F2FB;
                margin: 0;
                padding: 0;
              }
              .report-container {
                padding: 10px;
                border: 1px solid #000;
                margin: 10px;
                background-color: #E7F2FB;
              }
              .report-header {
                text-align: center;
                margin-bottom: 20px;
              }
              .report-id {
                font-size: 20px;
                font-weight: bold;
              }
              .section-divider {
                height: 2px;
                background-color: #000;
                margin: 10px 0;
              }
              .section-title {
                text-align: center;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
              }
              .info-column {
                flex: 1;
              }
              .info-text {
                margin-bottom: 5px;
              }
              .divider {
                height: 1px;
                background-color: #000;
                margin: 2px 0;
              }
              .graph-section {
                text-align: center;
                background-color: #FFFFFF;
                padding: 10px;
                border-radius: 10px;
                margin: 10px 0;
              }
              .footer-text {
                text-align: center;
                font-weight: bold;
                margin-top: 20px;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="report-container">
              <div class="report-header">
                <div class="report-id">Yearly Report</div>
                <div class="section-title">Date generated: 28/12/2024</div>
              </div>
              <div class="section-divider"></div>
              <div class="section-title">General Information</div>
              <div class="section-divider"></div>
              <div class="info-section">
                <div class="info-column">
                  <div class="info-text">Name</div>
                  <div class="divider"></div>
                  <div class="info-text">Age</div>
                  <div class="divider"></div>
                  <div class="info-text">Gender</div>
                  <div class="divider"></div>
                  <div class="info-text">National ID</div>
                  <div class="divider"></div>
                  <div class="info-text">Diabetes Type</div>
                  <div class="divider"></div>
                  <div class="info-text">Phone Number</div>
                </div>
                <div class="info-column">
                  <div class="info-text">: Muna Ahmad</div>
                  <div class="divider"></div>
                  <div class="info-text">: 33 Y</div>
                  <div class="divider"></div>
                  <div class="info-text">: Female</div>
                  <div class="divider"></div>
                  <div class="info-text">: 1234567899</div>
                  <div class="divider"></div>
                  <div class="info-text">: Type 1</div>
                  <div class="divider"></div>
                  <div class="info-text">: 0791234567</div>
                </div>
              </div>
              <div class="section-divider"></div>
              <div class="section-title">Medication Information</div>
              <div class="section-divider"></div>
              <div class="info-section">
                <div class="info-column">
                  <div class="info-text">KFT</div>
                  <div class="divider"></div>
                  <div class="info-text">LFT</div>
                  <div class="divider"></div>
                  <div class="info-text">BMI</div>
                  <div class="divider"></div>
                  <div class="info-text">Weight</div>
                  <div class="divider"></div>
                  <div class="info-text">Height</div>
                  <div class="divider"></div>
                  <div class="info-text">Waist Size</div>
                  <div class="divider"></div>
                  <div class="info-text">HbA1c</div>
                </div>
                <div class="info-column">
                  <div class="info-text">: 0.743</div>
                  <div class="divider"></div>
                  <div class="info-text">: Not provided</div>
                  <div class="divider"></div>
                  <div class="info-text">: 22.9</div>
                  <div class="divider"></div>
                  <div class="info-text">: 65 kg</div>
                  <div class="divider"></div>
                  <div class="info-text">: 168 cm</div>
                  <div class="divider"></div>
                  <div class="info-text">: 86 cm</div>
                  <div class="divider"></div>
                  <div class="info-text">: [6.5, 6.7, 6.8, 6.6]</div>
                </div>
              </div>
              <div class="section-divider"></div>
              <div class="graph-section">
                <div class="section-title">Trend Analysis</div>
                <img src="data:image/png;base64,${chartImage}" />
              </div>
              <div class="footer-text">Thank you for your trust.</div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const newPath = `${FileSystem.documentDirectory}${record.id}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: newPath });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error sharing the report:", error);
    }
  };

  const generateChartImage = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
      });
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error capturing chart image:", error);
      return "";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.reportContainer}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportId}>Yearly Report</Text>
        <Text style={styles.sectionTitle}>Date generated: 28/12/2024</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareIcon}>
          <Image
            source={require("../../../images/share.png")}
            style={styles.shareIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>General Information</Text>
      <View style={styles.sectionDivider} />
      <View style={styles.infoSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.detail}></Text>
          <Text style={styles.infoText}>Name</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Age</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Gender</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>National ID</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Diabetes Type</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Phone Number</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.detail}></Text>
          <Text style={styles.infoText}>: Muna Ahmad</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 33 Y</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: Female</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 1234567899</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: Type 1</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 0791234567</Text>
        </View>
      </View>
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionTitle}>Medication Information</Text>
      <View style={styles.sectionDivider} />
      <View style={styles.infoSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.detail}></Text>
          <Text style={styles.infoText}>KFT</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>LFT</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>BMI</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Weight</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Height</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Waist Size</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>HbA1c</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.detail}></Text>
          <Text style={styles.infoText}>: 0.743</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: Not provided</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 22.9</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 65 kg</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 168 cm</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: 86 cm</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>: [6.5, 6.7, 6.8, 6.6]</Text>
        </View>
      </View>
      <View style={styles.sectionDivider} />
      <View style={styles.graphSection} ref={chartRef}>
        <Text style={styles.sectionTitle}>Trend Analysis</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr"],
            datasets: [
              {
                data: [6.5, 6.7, 6.8, 6.6],
              },
            ],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#E7F2FB",
            backgroundGradientFrom: "#E7F2FB",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          }}
          style={styles.chartStyle}
        />
      </View>
      <Text style={styles.footerText}>Thank you for your trust.</Text>
    </ScrollView>
  );
}
