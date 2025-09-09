import React from 'react';
import { User, MapPin, Truck, FileText, Users } from 'lucide-react';

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
}

interface DataDisplayProps {
  data: FormData;
  onEdit: () => void;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ data, onEdit }) => {
  const formatValue = (value: string) => {
    return value || 'માહિતી ઉપલબ્ધ નથી';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg gujarati-text">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">કૃષક ચકાસણી અહેવાલ</h1>
        <p className="text-gray-600">સબમિટ કરેલ માહિતી</p>
      </div>

      {/* Personal Information */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-blue-800">વ્યક્તિગત માહિતી</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">ખેડૂતનું નામ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.farmerName)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">વર્ષ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.year)}</p>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-green-800">સ્થાન માહિતી</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">ગામ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.village)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">તાલુકો:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.taluka)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">જિલ્લો:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.district)}</p>
          </div>
          <div className="md:col-span-3">
            <span className="text-sm text-gray-600">જમીન ખાતા નંબર:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.landAccountNumber)}</p>
          </div>
        </div>
      </div>

      {/* Tractor Information */}
      <div className="bg-orange-50 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <Truck className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold text-orange-800">ટ્રેક્ટર માહિતી</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">ટ્રેક્ટર કંપની:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.tractorCompany)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">મોડલ કોડ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.modelCode)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">ચેસિસ નંબર:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.chassisNumber)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">એન્જિન નંબર:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.engineNumber)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">RTO પાસિંગ નંબર:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.rtoPassingNumber)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">RTO પાસિંગ તારીખ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.rtoPassingDate)}</p>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="bg-yellow-50 rounded-xl p-6 mb-6">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-yellow-600 mr-2" />
          <h2 className="text-xl font-semibold text-yellow-800">ખરીદી માહિતી</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">ઓથોરાઈઝ ડીલર નામ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.dealerName)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">બિલ નંબર:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.billNumber)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">બિલ તારીખ:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.billDate)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">અરજદારની સહી:</span>
            <p className="font-semibold text-gray-800">{formatValue(data.applicantSignature)}</p>
          </div>
        </div>
      </div>

      {/* Witness Information */}
      <div className="bg-purple-50 rounded-xl p-6 mb-8">
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-purple-800">સાક્ષી માહિતી</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Witness 1 */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-purple-700 mb-3">સાક્ષી ૧</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">નામ:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness1Name)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">સહી:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness1Signature)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ગામ:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness1Village)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">તાલુકો:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness1Taluka)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">જિલ્લો:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness1District)}</p>
              </div>
            </div>
          </div>

          {/* Witness 2 */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-purple-700 mb-3">સાક્ષી ૨</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">નામ:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness2Name)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">સહી:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness2Signature)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ગામ:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness2Village)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">તાલુકો:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness2Taluka)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">જિલ્લો:</span>
                <p className="font-semibold text-gray-800">{formatValue(data.witness2District)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          માહિતી સંપાદિત કરો
        </button>
      </div>
    </div>
  );
};

export default DataDisplay;