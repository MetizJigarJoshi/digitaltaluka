import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, FileText, Save, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DataDisplay from './DataDisplay';

interface FormData {
  farmerName: string;
  village: string;
  taluka: string;
  district: string;
  tractorCompany: string;
  modelCode: string;
  chassisNumber: string;
  engineNumber: string;
  rtoPassingNumber: string;
  rtoPassingDate: string;
  dealerName: string;
  billNumber: string;
  billDate: string;
  farmerSignature: string;
  year: string;
  landAccountNumber: string;
  applicantSignature: string;
  witness1Name: string;
  witness1Signature: string;
  witness1Village: string;
  witness1Taluka: string;
  witness1District: string;
  witness2Name: string;
  witness2Signature: string;
  witness2Village: string;
  witness2Taluka: string;
  witness2District: string;
  subsidyAmount: string;
  purchaseAmount: string;
  beneficiaryBankName: string;
  bankIFSC: string;
  accountNumber: string;
  bankNameAndBranch: string;
  age: string;
  aadharCardNumber: string;
}

const FarmerForm: React.FC = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [showForm, setShowForm] = useState(true);
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>();

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a temporary div with the PDF content
      const formData = getValues();
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '210mm';
      pdfContent.style.minHeight = '297mm';
      pdfContent.style.padding = '20mm';
      pdfContent.style.fontFamily = "'Noto Sans Gujarati', sans-serif";
      pdfContent.style.fontSize = '14px';
      pdfContent.style.lineHeight = '1.6';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.color = 'black';
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '0';

      // Helper function to get field value or dotted line
      const getFieldValue = (value: string) => {
        return value && value.trim() ? `<strong>${value}</strong>` : '............................';
      };

      // Second Page Content (originally first)
      const secondPageContent = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 24px; font-weight: bold; text-decoration: underline; margin: 0 0 50px 0;">ટ્રેક્ટર ના સાધનિક કાગળો</h1>
          
          <div style="text-align: justify; margin-bottom: 40px; line-height: 2.2;">
            <p style="margin-bottom: 25px;">
              ખેડૂત લાભાર્થી ${getFieldValue(formData.farmerName)} ગામ: ${getFieldValue(formData.village)}, તાલુકો: ${getFieldValue(formData.taluka)}
જિલ્લો: ${getFieldValue(formData.district)} ને જિલ્લા ખેતીવાડી અધિકારી, જિલ્લા પંચાયત, ${getFieldValue(formData.district)} દ્વારા પુવમંજુરી આપેલ છે જેની આજ રોજ ભૌિતક ચકાસણી કરતા સરકાર માન્ય ટ્રેક્ટર કંપની ${getFieldValue(formData.tractorCompany)} નું માન્ય મોડેલ ${getFieldValue(formData.modelCode)} ચેસીઝ  નંબર ${getFieldValue(formData.chassisNumber)} એન્જિન નંબર ${getFieldValue(formData.engineNumber)} જેનો RTO પાસિંગ નંબર ${getFieldValue(formData.rtoPassingNumber)} તારીખ ${getFieldValue(formData.rtoPassingDate)} થી ઓથોરાઈઝ ડીલર ${getFieldValue(formData.dealerName)} પાસેથી બિલ નંબર ${getFieldValue(formData.billNumber)} તારીખ ${getFieldValue(formData.billDate)} થી ખરીદ કરેલ છે. અને જેનાં રજુ થયેલ સાધનીક કાગળોની ચકાસણી કરતા બરાબર જણાય છે./જણાતું નથી. તો સહાયની રકમની ચુકવણી કરવા ભલામણ કરવામાં આવે છે. / આવતુ નથી.ભલામણ નથી તેવા કિસ્સામાં<strong> → ટુંકી નોંધ--</strong>
            <p style="margin-bottom: 5px;">
              સ્થળ :
            </p>
            <p style="margin-bottom: 40px;">
              તારીખ:
            </p>
          </div>
        </div>

        <div style="margin-top: 60px; margin-bottom: 40px;">
          <div style="text-align: right; margin-bottom: 20px;">
            <p style="margin-bottom: 10px;">ખેડૂત લાભાર્થીની સહી ..............</p>
            <p style="margin-bottom: 40px;">ખેડૂતનું નામ : ${getFieldValue(formData.farmerName)}</p>
          </div>
        </div>

        <div style="text-align: right; margin-top: 80px;">
          <p style="font-weight: bold;">ચકાસણી કરનાર કર્મચારી/અધિકારીઓ ની સહી</p>
        </div>
      `;

      // First Page Content (originally second)
      const firstPageContent = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">એજીઆર-૫૦ યોજના અંતગત</h2>
          <p>શ્રી/શ્રીમતી <strong>${getFieldValue(formData.farmerName)}</strong> ગામ:- <strong>${getFieldValue(formData.village)}</strong>, તાલુકો:- <strong>${getFieldValue(formData.taluka)}</strong>,જિલ્લો:- <strong>${getFieldValue(formData.district)}</strong> દ્વારા ટ્રેક્ટર ખરીદ કરીને રજુ કરેલ સાધનીક    કાગળોની યાદી</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 30px;">
          <thead>
            <tr style="border: 2px solid black;">
              <th style="border: 2px solid black; padding: 8px; text-align: center; width: 8%;">અનુ.<br/>ક્ર.</th>
              <th style="border: 2px solid black; padding: 8px; text-align: center; width: 62%;">સાધનીક કાગળો</th>
              <th style="border: 2px solid black; padding: 8px; text-align: center; width: 30%;">રજુ કરેલ છે કે નહીં કે<br/>કે ના</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧</td>
              <td style="border: 1px solid black; padding: 6px;">I khedut portal પર કરેલ અરજી ખેડૂતની અને ગામસેવકની સહી સાથે</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૨</td>
              <td style="border: 1px solid black; padding: 6px;">સંયુક્ત ખાતેદાર માટે સમ્મતિ પત્રક</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૩</td>
              <td style="border: 1px solid black; padding: 6px;">૮-અ (યોરીજનલ) ૩ માસ થી ઓછા સમયનો</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૪</td>
              <td style="border: 1px solid black; padding: 6px;">આધાર કાર્ડની નકલ</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૫</td>
              <td style="border: 1px solid black; padding: 6px;">બેંક ખાતાની નકલ (બેંક ના વિકસા સાથે) ઝેરોક્સ અથવા ૨૬ કરેલ ચેક</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૬</td>
              <td style="border: 1px solid black; padding: 6px;">અનુસૂચિતજાતિ /અનુસૂચિત જન જાતિનો સહમ અધિકારીશ્રીનો દાખલો રજુ કરેલ છે).લાગુ પડતુ<br/>હોય તો</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૭</td>
              <td style="border: 1px solid black; padding: 6px;">દિવ્યાંગ પ્રમાણપત્રની નકલ લાગુ પડતુ હોય તો</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૮</td>
              <td style="border: 1px solid black; padding: 6px;">પૂર્વ મંજૂરીના પત્રની નકલ (યોરીજનલ)</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૯</td>
              <td style="border: 1px solid black; padding: 6px;">ટ્રેક્ટર ખરીદીનુ બીલ (યોરીજનલ) કંપની, મોડેલ,એન્જન નેસીસ નંબર તેમજ પી.ડી.આઈ.હોસ્ટ<br/>પાસ સ્પષ્ટ લખાય તેમ લખવુ.</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૦</td>
              <td style="border: 1px solid black; padding: 6px;">આઈ ખેડૂત પોર્ટલ મુજબ માન્ય કંપનીનું પ્રાઈસ લીસ્ટ સાથેનું ઝેરોએનલ લીસ્ટ ડીલરના સહી<br/>વિકસા સાથેનું રજુ કરેલ છે.?</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૧</td>
              <td style="border: 1px solid black; padding: 6px;">ડીલરની સલામ (યોરીજનલ)</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૨</td>
              <td style="border: 1px solid black; padding: 6px;">ટ્રેક્ટર ખરીદી અંગેના નાણા વહીવટી રસીદ(યોરીજનલ)</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૩</td>
              <td style="border: 1px solid black; padding: 6px;">ટ્રેક્ટર સાથે લાભાર્થીનો ફોટો (૧,ટ્રેક્ટર નંબર મોડેલ દેખાય તેમ. ૨, એન્જન નેસીસ નંબર<br/>દેખાય તે રીતે પડાવવો)વાહની સાડીસાત ભાગ પર ગોંદલાકી ખાતાની એ.યુ.આર-૫૦<br/>યોજના ૨૦૨૫-૨૬ ના સહયોગથી - તે મુજબ પેઇન્ટ કરાવવાનુ રહેશે.અને ટ્રેક્ટર યકાસણી<br/>વખતે કરજયાત હેવુ જોઈએ</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૪</td>
              <td style="border: 1px solid black; padding: 6px;">ટ્રેક્ટરની આર સી બુકની નકલ (અસલ સાથે યકાસણી માટે રજુ કરવાની રહેશે)ઝેરોક્સ નકલ સ્વ<br/>પ્રમાણીત) હિસા રીપોર્ટ નહિ આવે</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૫</td>
              <td style="border: 1px solid black; padding: 6px;">ટ્રેક્ટરના વિમાની નકલ (ઝેરોક્સ નકલ સ્વ પ્રમાણીત )</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૬</td>
              <td style="border: 1px solid black; padding: 6px;">બાંધકી પત્ર નમૂના મુજબ (યોરીજનલ)</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૭</td>
              <td style="border: 1px solid black; padding: 6px;">નાણા મંત્રા અંગેની એકરારના સ્પીડ (યોરીજનલ)</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black; padding: 6px; text-align: center;">૧૮</td>
              <td style="border: 1px solid black; padding: 6px;">સેલ્ફ ડીકલેરેશન (નામ કેરકર હેવા તો)</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
            </tr>
          </tbody>
        </table>

        <p style="margin-bottom: 5px; font-size: 12px;">ઉપર મુજબના સાધનીક કાગળો બિડાણ કરેલ છે</p>
        <div>
          <p style="font-weight: bold;">ગામસેવકની સહી / વિકસે</p>
        </div>
      `;

      // Third Page Content
      const thirdPageContent = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 30px 0;">-: બાંહેધરી  પત્ર:-</h1>
          <hr style="border: 1px solid black; margin-bottom: 40px;">
        </div>

        <div style="text-align: justify; line-height: 1.8; font-size: 14px; margin-bottom: 40px;">
          <p style="margin-bottom: 5px;">
            ખેડુતનુ નામ <strong>${getFieldValue(formData.farmerName)}</strong> ગામ: <strong>${getFieldValue(formData.village)}</strong>, તાલુકો:   <strong>${getFieldValue(formData.taluka)}</strong>,જિલ્લો: <strong>${getFieldValue(formData.district)}</strong> આથી લખી આપુ છુ કે અમોએ ખેતીવાડી વિભાગ, જિલ્લા પંચાયત,<strong>${getFieldValue(formData.district)}</strong> ની વર્ષ-<strong>${getFieldValue(formData.year) || '2024-2025'}</strong> માં જમીન ખાતા નં <strong>${getFieldValue(formData.landAccountNumber)}</strong> ટ્રેક્ટર સહાય યોજના (યોજનાર ૫૦) હેઠળ માન્ય ડીલર શ્રી <strong>${getFieldValue(formData.dealerName)}</strong> પાસેથી બિલ નંબર <strong>${getFieldValue(formData.billNumber)}</strong>,તારીખ<strong>${getFieldValue(formData.billDate)}</strong> થી ટ્રેક્ટર કંપની તથા મોડેલ નુ ટ્રેક્ટર ખરીદ કરેલ છે. </p>
           <p style="margin-bottom: 5px;"> આથી હુ બાહેંધારી આપુ છુ કે, ઉપરોક્ત યોજના હેઠળ ખરીદેલ ટ્રેક્ટર તેમજ સાધનો હુ <strong>૧૦ વર્ષ સુધી કોઈને પણ વેચાણ કે ભેટ આપીશ નહિ</strong> અને આ સિવાય અન્ય યોજનામાં સહાય લેવુ નહિ જેની ખાત્રી આપુ છુ અને સરકારશ્રીના તમામ નીતિ નિયમોનુ હુ પાલન કરીશ તેની ખાત્રી આપુ છુ તથા આ સાથે રજુ કરેલ સાધનીક કાગળો કે સહાય કેળવાં સરકારશ્રી દ્વારા નક્કી કરેલ તમામ શરતોને હુ આધિન રહીશ તેની હુ સોગંધ પૂર્વક ખાત્રી આપુ છુ. આ સાથે રજુ કરેલ સાધનીક કાગળો ખોટા કે બનાવટી હશે તો તેની સંપૂર્ણ જવાબદારી મારી પોતાની રહેશે.
          </p>
        </div>

        <div style="text-align: right; margin-bottom: 60px;">
          <p style="margin-bottom: 40px;"><strong>અરજદારની સહી</strong></p>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="margin-bottom: 5px;"><strong>૧.</strong></p>
          <p style="margin-bottom: 5px;">સાક્ષીની સહી: ${getFieldValue(formData.witness1Signature)}</p>
          <p style="margin-bottom: 5px;">સાક્ષીનુ નામ: ${getFieldValue(formData.witness1Name)}</p>
          <p style="margin-bottom: 5px;">ગામ: ${getFieldValue(formData.witness1Village)}, તાલુકો: ${getFieldValue(formData.witness1Taluka)}, જિલ્લો:   ${getFieldValue(formData.witness1District)}</p>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="margin-bottom: 5px;"><strong>૨.</strong></p>
          <p style="margin-bottom: 5px;">સાક્ષીની સહી:${getFieldValue(formData.witness2Signature)}</p>
          <p style="margin-bottom: 5px;">સાક્ષીનુ નામ:${getFieldValue(formData.witness2Name)}</p>
          <p style="margin-bottom: 5px;">ગામ: ${getFieldValue(formData.witness2Village)}, તાલુકો: ${getFieldValue(formData.witness2Taluka)}, જિલ્લો:  ${getFieldValue(formData.witness2District)}</p>
        </div>
      `;

      // Fourth Page Content
      const fourthPageContent = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 18px; font-weight: bold; margin: 0 0 30px 0; text-decoration: underline;">નાણા મલ્યા અંગેની એડવાન્સ રસીદ</h1>
          <hr style="border: 1px solid black; margin-bottom: 40px;">
        </div>

        <div style="text-align: justify; line-height: 1.8; font-size: 14px; margin-bottom: 20px;">
          <p style="margin-bottom: 5px;">
            લાભાર્થી ખેડૂત નામ:<strong>${getFieldValue(formData.farmerName)}</strong>
          </p>
          <p style="margin-bottom: 5px;">
            ગામ:<strong>${getFieldValue(formData.village)}</strong>,
          </p>
          <p style="margin-bottom: 5px;">
            તાલુકો:<strong>${getFieldValue(formData.taluka)}</strong>,
          </p>
          <p style="margin-bottom: 5px;">
            જિલ્લો:<strong>${getFieldValue(formData.district)}</strong>
          </p>
          <p style="margin-bottom: 20px;">
            આથી હુ નીચે સહી કરનાર <strong>${getFieldValue(formData.farmerName)}</strong> સરનામું ગામ <strong>${getFieldValue(formData.village)}</strong>,તાલુકો <strong>${getFieldValue(formData.taluka)}</strong>,જિલ્લો <strong>${getFieldValue(formData.district)}</strong> આથી લખી આપું છું કે <strong>${getFieldValue(formData.tractorCompany)}</strong> કંપની નું <strong>${getFieldValue(formData.modelCode)}</strong> ટ્રેક્ટર ખરીદ કરેલ છે. જેનો આર.ટી.ઓ પાસિંગ નંબર <strong>${getFieldValue(formData.rtoPassingNumber)}</strong> છે.જેની ખરીદ કિંમત રૂ. <strong>${getFieldValue(formData.purchaseAmount)}</strong> (આંકડે રૂપિયા <strong>${getFieldValue(formData.purchaseAmountword)}</strong>) છે.</p> 
            <p>જેમાં ખેતીવાડી ખાતા દ્વારા મારી સબસીડીની રકમ રૂ.<strong>${getFieldValue(formData.subsidyAmount) || '200000'}</strong>/-આંકડે રૂપિયા <strong>${getFieldValue(formData.subsidyAmountword)}</strong> ખૂબ મને ચૂકવી આપશો જે મને મળવા બરાબર છે.</p>
        </div>

        <div style="margin-bottom: 20px;display:flex;">
          <div>
            <p style="margin-bottom: 5px;">૧. લાભાર્થીનું બેંક મુજબ નામ:-${getFieldValue(formData.beneficiaryBankName)}</p>
            <p style="margin-bottom: 5px;">3. બેંક IFS Code :-${getFieldValue(formData.bankIFSC)}</p>
            <p style="margin-bottom: 5px;">5. એકાઉન્ટ નંબર:-${getFieldValue(formData.accountNumber)}</p>
          </div>
          <div style="margin-left 200px;"">
            <p style="margin-bottom: 5px;">૨. બેંક નું નામ :-${getFieldValue(formData.bankName)}</p>
            <p style="margin-bottom: 5px;">4. શાખાનું નામ અને કોડ નંબર :-${getFieldValue(formData.bankbranchname)}</p>
          </div>
          
          
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;width:100%;">
          <div style="width: 70%;">
            <p style="margin-bottom: 10px;"><strong>૧.</strong></p>
            <p style="margin-bottom: 5px;">સાક્ષીની સહી: ${getFieldValue(formData.witness1Signature)}</p>
            <p style="margin-bottom: 5px;">સાક્ષીનુ નામ: ${getFieldValue(formData.witness1Name)}</p>
            <p style="margin-bottom: 5px;">ગામ ${getFieldValue(formData.witness1Village)}, તાલુકો ${getFieldValue(formData.witness1Taluka)},જિલ્લો-  ${getFieldValue(formData.witness1District)}</p>
          </div>
          <div style="width: 100px; text-align: center; border: 2px solid black; padding: 15px; margin-top: 10px; height: 120px;">
            <p style="margin-bottom: 10px;">ખેડૂત ની સહી</p>
            <div style="height: 30px;"></div>
            <p style="font-size: 12px;">વḍયુટીકીટ લગાવવી</p>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <p style="margin-bottom: 10px;"><strong>૨.</strong></p>
          <p style="margin-bottom: 5px;">સાક્ષીની સહી: ${getFieldValue(formData.witness2Signature)}</p>
          <p style="margin-bottom: 5px;">સાક્ષીનુ નામ: ${getFieldValue(formData.witness2Name)}</p>
          <p style="margin-bottom: 5px;">ગામ  ${getFieldValue(formData.witness2Village)}, તાલુકો ${getFieldValue(formData.witness2Taluka)},જિલ્લો- ${getFieldValue(formData.witness2District)}</p>
        </div>
      `;

      // Fifth Page Content
      const fifthPageContent = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">કરાર કમાંડ/વહીવટ/૧૦૨૦૨૪/૪૨૫/વસુધા-૨ નું બિડાણ</h1>
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 20px 0;">એમેન્ડર-એ</h2>
          <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 30px 0; text-decoration: underline;">સ્વ ઘોષણા (Self declaration)</h3>
          <hr style="border: 1px solid black; margin-bottom: 40px;">
        </div>

        <div style="text-align: justify; line-height: 1.8; font-size: 14px; margin-bottom: 40px;">
          <p style="margin-bottom: 30px;">
            આથી હું નીચે સહી કરનાર <strong>${getFieldValue(formData.farmerName)}</strong> ઉમર <strong>${getFieldValue(formData.age)}</strong>, ગામ <strong>${getFieldValue(formData.village)}</strong>, તાલુકો <strong>${getFieldValue(formData.taluka)}</strong>,જિલ્લો-<strong>${getFieldValue(formData.district)}</strong> જમીન ખાતા નં-<strong>${getFieldValue(formData.landAccountNumber)}</strong> ની ના રહેવાસી આથી હું જાહેર કરું છું કે, મારા દ્વારા આપવામાં આવેલ માહિતી કે હકીકતો અને અરજીમાં અનુસંધાને જોડેલ હકીકતો મારી જાણ અને માત્રામાં મુજબ સાચા છે. અને તેમાં કોઈ બાબત છુપાવેલ નથી. <strong>હું એ જાણું છું, ખોટી માહીતી કે દસ્તાવેજ રજુ કરવા એ કાયદા હેઠળ શિક્ષાને પાત્ર છે. અને આવા</strong><strong>સંજોગોમાં ખોટી માહિતી કે હકીકતોના આધારે મને મળેલ લાભ રદ થવા પાત્ર છે.</strong>
          </p>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="margin-bottom: 20px;">
            વધુમાં આજ રોજ કરેલ અરજીમાં માત્ર નામ <strong>${getFieldValue(formData.farmerName)}</strong> છે. જ્યારે મારા જમીન ખાતા તંત્રમાં માત્ર 
            નામ <strong>${getFieldValue(formData.farmerName)}</strong> છે જે બંને નામ <strong>એક જ છે</strong> જેની હું ખાતરી આપું છું .
          </p>
        </div>

        <div style="text-align: right; margin-bottom: 5px;">
          <p style="margin-bottom: 5px;">સહી .............</p>
        </div>

        <div style="text-align: right; margin-bottom: 30px;">
          <p style="margin-bottom: 20px;">આધાર કાર્ડ નં. ${getFieldValue(formData.aadharCardNumber)}</p>
        </div>
      `;

      // Create first page
      pdfContent.innerHTML = firstPageContent;
        
      // Add to document temporarily
      document.body.appendChild(pdfContent);
        
      // Wait for fonts to load
      await document.fonts.ready;
        
      // Generate canvas from the content
      const canvas = await html2canvas(pdfContent, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        removeContainer: true
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // Create second page
      pdfContent.innerHTML = secondPageContent;
      
      // Wait for fonts to load again
      await document.fonts.ready;
      
      // Generate canvas for second page
      const canvas2 = await html2canvas(pdfContent, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        removeContainer: true
      });
      
      // Add second page to PDF
      pdf.addPage();
      const imgData2 = canvas2.toDataURL('image/jpeg', 0.7);
      pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // Create third page
      pdfContent.innerHTML = thirdPageContent;
      
      // Wait for fonts to load again
      await document.fonts.ready;
      
      // Generate canvas for third page
      const canvas3 = await html2canvas(pdfContent, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        removeContainer: true
      });
      
      // Add third page to PDF
      pdf.addPage();
      const imgData3 = canvas3.toDataURL('image/jpeg', 0.7);
      pdf.addImage(imgData3, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // Create fourth page
      pdfContent.innerHTML = fourthPageContent;
      
      // Wait for fonts to load again
      await document.fonts.ready;
      
      // Generate canvas for fourth page
      const canvas4 = await html2canvas(pdfContent, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        width: 794,
        height: 1123,
        logging: false,
        removeContainer: true
      });
      
      // Add fourth page to PDF
      pdf.addPage();
      const imgData4 = canvas4.toDataURL('image/jpeg', 0.7);
      pdf.addImage(imgData4, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // Create fifth page
      pdfContent.innerHTML = fifthPageContent;
      
      // Wait for fonts to load again
      await document.fonts.ready;
      
      // Generate canvas for fifth page
      const canvas5 = await html2canvas(pdfContent, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        removeContainer: true,
        scrollX: 0,
        scrollY: 0
      });
      
      // Add fifth page to PDF
      pdf.addPage();
      const imgData5 = canvas5.toDataURL('image/jpeg', 0.7);
      pdf.addImage(imgData5, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // Remove temporary element
      document.body.removeChild(pdfContent);
      
      pdf.save('chakasani-aheval.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF બનાવતી વખતે ભૂલ આવી. કૃપા કરીને ફરીથી પ્રયાસ કરો.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const onSaveData = async (data: FormData) => {
    setIsSaving(true);
    try {
      // Store submitted data
      setSubmittedData(data);
      
      // Simulate saving data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form data saved:', data);
      alert('ડેટા સફળતાપૂર્વક સેવ થયો!');
      
      // Store in localStorage for demo
      localStorage.setItem('farmerFormData', JSON.stringify(data));
      
      // Show data display after successful PDF generation
      setShowForm(false);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('ડેટા સેવ કરતી વખતે ભૂલ આવી. કૃપા કરીને ફરીથી પ્રયાસ કરો.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setShowForm(true);
    setSubmittedData(null);
  };

  // Show data display if form has been submitted
  if (!showForm && submittedData) {
    return <DataDisplay data={submittedData} onEdit={handleEdit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-green-200 pb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">ટ્રેક્ટર ના સાધનિક કાગળો</h1>
          </div>

          <form onSubmit={handleSubmit(onSaveData)} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                મૂળભૂત માહિતી
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ખેડૂતનું નામ *
                  </label>
                  <input
                    {...register('farmerName', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ખેડૂતનું નામ દાખલ કરો"
                  />
                  {errors.farmerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.farmerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ગામ *
                  </label>
                  <input
                    {...register('village', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ગામનું નામ દાખલ કરો"
                  />
                  {errors.village && (
                    <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    તાલુકો *
                  </label>
                  <input
                    {...register('taluka', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="તાલુકાનું નામ દાખલ કરો"
                  />
                  {errors.taluka && (
                    <p className="text-red-500 text-sm mt-1">{errors.taluka.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    જિલ્લો *
                  </label>
                  <input
                    {...register('district', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="જિલ્લાનું નામ દાખલ કરો"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
                  )}
                </div>

                                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ઉમર
                  </label>
                  <input
                    {...register('age')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ઉમર દાખલ કરો"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    આધાર કાર્ડ નંબર
                  </label>
                  <input
                    {...register('aadharCardNumber')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="આધાર કાર્ડ નંબર દાખલ કરો"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Tractor Details */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                ટ્રેક્ટર વિગતો
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ટ્રેક્ટર કંપનીનું નામ *
                  </label>
                  <input
                    {...register('tractorCompany', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ટ્રેક્ટર કંપનીનું નામ દાખલ કરો"
                  />
                  {errors.tractorCompany && (
                    <p className="text-red-500 text-sm mt-1">{errors.tractorCompany.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    મોડેલ કોડ *
                  </label>
                  <input
                    {...register('modelCode', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="મોડેલ કોડ દાખલ કરો"
                  />
                  {errors.modelCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.modelCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ચેસીઝ નંબર *
                  </label>
                  <input
                    {...register('chassisNumber', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ચેસીઝ નંબર દાખલ કરો"
                  />
                  {errors.chassisNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.chassisNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    એન્જિન નંબર *
                  </label>
                  <input
                    {...register('engineNumber', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="એન્જિન નંબર દાખલ કરો"
                  />
                  {errors.engineNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.engineNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RTO પાસિંગ નંબર *
                  </label>
                  <input
                    {...register('rtoPassingNumber', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="RTO પાસિંગ નંબર દાખલ કરો"
                  />
                  {errors.rtoPassingNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.rtoPassingNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RTO પાસિંગ તારીખ *
                  </label>
                  <input
                    type="date"
                    {...register('rtoPassingDate', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.rtoPassingDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.rtoPassingDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Purchase Details */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">
                ખરીદી વિગતો
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    વર્ષ *
                  </label>
                  <input
                    {...register('year', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="વર્ષ દાખલ કરો (જેમ કે 2024-2025)"
                    defaultValue="2024-2025"
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    જમીન ખાતા નંબર
                  </label>
                  <input
                    {...register('landAccountNumber')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="જમીન ખાતા નંબર દાખલ કરો"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ઓથોરાઈઝ ડીલર નામ *
                  </label>
                  <input
                    {...register('dealerName', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ડીલરનું નામ દાખલ કરો"
                  />
                  {errors.dealerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.dealerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    બિલ નંબર *
                  </label>
                  <input
                    {...register('billNumber', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="બિલ નંબર દાખલ કરો"
                  />
                  {errors.billNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.billNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    બિલ તારીખ *
                  </label>
                  <input
                    type="date"
                    {...register('billDate', { required: 'આ ફીલ્ડ આવશ્યક છે' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {errors.billDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.billDate.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ખરીદ કિંમત 
                  </label>
                  <input
                    {...register('purchaseAmount')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ખરીદ કિંમત દાખલ કરો (જેમ કે 200000)"
                    defaultValue="500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ખરીદ કિંમત શબ્દો મા
                  </label>
                  <input
                    {...register('purchaseAmountword')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ખરીદ કિંમત શબ્દો મા (જેમ કે Two lakhs)"
                    defaultValue="Two lakhs"
                  />
                </div>
                
              </div>
            </div>

            {/* Section 4: Witness Details */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                સાક્ષી વિગતો
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-4">સાક્ષી ૧</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૧ નું નામ
                    </label>
                    <input
                      {...register('witness1Name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૧ નું નામ દાખલ કરો"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૧ ની ગામ
                    </label>
                    <input
                      {...register('witness1Village')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૧ ની ગામ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૧ ની તાલુકો
                    </label>
                    <input
                      {...register('witness1Taluka')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૧ ની તાલુકો"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૧ ની જિલ્લો
                    </label>
                    <input
                      {...register('witness1District')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૧ ની જિલ્લો"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-700 mb-4">સાક્ષી ૨</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૨ નું નામ
                    </label>
                    <input
                      {...register('witness2Name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૨ નું નામ દાખલ કરો"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૨ ની ગામ
                    </label>
                    <input
                      {...register('witness2Village')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૨ ની ગામ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૨ ની તાલુકો
                    </label>
                    <input
                      {...register('witness2Taluka')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૨ ની તાલુકો"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      સાક્ષી ૨ ની જિલ્લો
                    </label>
                    <input
                      {...register('witness2District')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="સાક્ષી ૨ ની જિલ્લો"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Banking Details */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                બેંકિંગ વિગતો
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    સબસીડીની રકમ
                  </label>
                  <input
                    {...register('subsidyAmount')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="સબસીડીની રકમ દાખલ કરો (જેમ કે 200000)"
                    defaultValue="200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    સબસીડીની રકમ શબ્દો મા
                  </label>
                  <input
                    {...register('subsidyAmountword')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="સબસીડીની રકમ શબ્દો મા (જેમ કે Two lakhs)"
                    defaultValue="Two lakhs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    લાભાર્થીનું બેંક મુજબ નામ
                  </label>
                  <input
                    {...register('beneficiaryBankName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="બેંક મુજબ નામ દાખલ કરો"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    બેંક નું નામ
                  </label>
                  <input
                    {...register('bankName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="બેંક નું નામ અને શાખા દાખલ કરો"
                  />
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    શાખાનું નામ અને કોડ નંબર
                  </label>
                  <input
                    {...register('bankbranchname')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="બેંક નું નામ અને શાખા દાખલ કરો"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    બેંકનો IFSC કોડ
                  </label>
                  <input
                    {...register('bankIFSC')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="IFSC કોડ દાખલ કરો"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    એકાઉન્ટ નંબર
                  </label>
                  <input
                    {...register('accountNumber')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="એકાઉન્ટ નંબર દાખલ કરો"
                  />
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Download className="mr-2" size={20} />
                {isGeneratingPDF ? 'PDF બનાવી રહ્યા છે...' : 'PDF બનાવો'}
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Save className="mr-2" size={20} />
                {isSaving ? 'ડેટા સેવ કરી રહ્યા છે...' : 'ડેટા સેવ કરો'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerForm;