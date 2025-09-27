import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BottomNavigation from "../componentes/menu";

const { width } = Dimensions.get("window");

type Product = {
  id: number;
  name: string;
};

type Review = {
  photo: string;
  product: Product;
  rating: number;
  comment: string;
};

export default function Camera() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  // Productos de ejemplo (esto vendría de tu API)
  const products: Product[] = [
    { id: 1, name: "VASK Corduroy Utility Jacket" },
    { id: 2, name: "MONSA Oversized Graphic Jacket" },
    { id: 3, name: "HALLEN Vest" },
    { id: 4, name: "T-shirt Basic Cotton" },
  ];

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos acceso a tu galería para seleccionar fotos"
      );
      return false;
    }

    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos acceso a tu cámara para tomar fotos"
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setShowReviewModal(true);
    }
  };

  const selectFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setShowReviewModal(true);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Seleccionar foto", "¿Cómo quieres agregar tu foto?", [
      { text: "Cámara", onPress: takePhoto },
      { text: "Galería", onPress: selectFromGallery },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const submitReview = () => {
    if (!selectedProduct || rating === 0 || comment.trim().length === 0) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (comment.length > 200) {
      Alert.alert("Error", "El comentario no puede superar los 200 caracteres");
      return;
    }

    const newReview: Review = {
      photo: selectedImage!,
      product: selectedProduct,
      rating,
      comment: comment.trim(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Resetear formulario
    setSelectedImage(null);
    setSelectedProduct(null);
    setRating(0);
    setComment("");
    setShowReviewModal(false);

    Alert.alert("¡Éxito!", "Tu review ha sido enviada correctamente");
  };

  const renderStar = (index: number) => (
    <Pressable key={index} onPress={() => setRating(index + 1)}>
      <FontAwesome
        name={rating > index ? "star" : "star-o"}
        size={28}
        color={rating > index ? "#fbbf24" : "#d1d5db"}
      />
    </Pressable>
  );

  const renderReview = (review: Review, index: number) => (
    <View key={index} style={styles.reviewCard}>
      <Image source={{ uri: review.photo }} style={styles.reviewImage} />
      <View style={styles.reviewContent}>
        <Text style={styles.reviewProduct}>{review.product.name}</Text>
        <View style={styles.reviewRating}>
          {[...Array(review.rating)].map((_, i) => (
            <Text key={i}>⭐</Text>
          ))}
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comparte tu experiencia</Text>
        <Text style={styles.headerSubtitle}>
          Sube fotos con tus productos favoritos
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Botón principal para tomar/seleccionar foto */}
        <Pressable style={styles.photoButton} onPress={showImagePickerOptions}>
          <View style={styles.photoButtonContent}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.photoButtonTitle}>Agregar foto</Text>
            <Text style={styles.photoButtonSubtitle}>
              Toca para tomar una foto o seleccionar de galería
            </Text>
          </View>
        </Pressable>

        {/* Lista de reviews anteriores */}
        {reviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Tus reviews</Text>
            {reviews.map((review, index) => renderReview(review, index))}
          </View>
        )}

        {reviews.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>Sin reviews aún</Text>
            <Text style={styles.emptySubtitle}>
              ¡Sé el primero en compartir tu experiencia con nuestros productos!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal para formulario de review */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowReviewModal(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Crear Review</Text>
            <Pressable onPress={submitReview}>
              <Text style={styles.submitButton}>Enviar</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Imagen seleccionada */}
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
            )}

            {/* Selector de producto */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Producto *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.productSelector}>
                  {products.map((product) => (
                    <Pressable
                      key={product.id}
                      style={[
                        styles.productOption,
                        selectedProduct?.id === product.id &&
                          styles.productSelected,
                      ]}
                      onPress={() => setSelectedProduct(product)}
                    >
                      <Text
                        style={[
                          styles.productOptionText,
                          selectedProduct?.id === product.id &&
                            styles.productSelectedText,
                        ]}
                      >
                        {product.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Rating */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Calificación *</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => renderStar(index))}
              </View>
            </View>

            {/* Comentario */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                Comentario * ({comment.length}/200)
              </Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Cuéntanos qué te pareció el producto..."
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <BottomNavigation activeTab={4} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoButton: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  photoButtonContent: {
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  photoButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  photoButtonSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  reviewsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    elevation: 1,
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewProduct: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  cancelButton: {
    fontSize: 16,
    color: "#666",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  submitButton: {
    fontSize: 16,
    color: "#283D59",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  selectedImage: {
    width: width - 32,
    height: width - 32,
    borderRadius: 12,
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  productSelector: {
    flexDirection: "row",
    gap: 8,
  },
  productOption: {
    backgroundColor: "#f1f3f4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  productSelected: {
    backgroundColor: "#283D59",
  },
  productOptionText: {
    fontSize: 14,
    color: "#666",
  },
  productSelectedText: {
    color: "white",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 8,
  },
  star: {
    fontSize: 32,
    color: "#ddd",
  },
  starActive: {
    color: "#ffd700",
  },
  commentInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
