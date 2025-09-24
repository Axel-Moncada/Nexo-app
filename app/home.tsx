import BottomNavigation from "@/componentes/menu";
import { useState, useEffect } from "react";
import { useFavorites } from "@/providers/FavoritesProvider";
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    Dimensions
} from "react-native";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Usar el contexto de favoritos
  const { favorites, products, toggleFavorite, setProducts } = useFavorites();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrar productos basado en el texto de búsqueda
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Función para manejar favoritos
  const btnfavorito = (id: number) => {
    toggleFavorite(id);
  };

  // Función para verificar si un producto es favorito
  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  // Función para abrir el modal con información del producto
  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeProductModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();


      const Products = data.filter((product: any) => product.category === "men's clothing" || product.category === "women's clothing");

      const transformedProducts = Products.map((product: any) => ({
        id: product.id,
        name: product.title,
        price: `$${product.price}`,
        rating: product.rating.rate,
        image: product.image,
        description: product.description, // Agregar descripción
        category: product.category, // Agregar categoría
        isFavorite: false
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  type item = {
    id: number;
    name: string;
    price: string;
    rating: number;
    image: string;
    description?: string; // Agregar descripción opcional
    category?: string; // Agregar categoría opcional
    isFavorite: boolean;
  };

  const renderProduct = ({ item }: { item: item }) => {
    const isItemFavorite = isFavorite(item.id);
    
    return (
      <Pressable style={styles.productCard} onPress={() => openProductModal(item)}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <Pressable 
            style={styles.favoriteButton} 
            onPress={(e) => {
              e.stopPropagation(); // Evita que se abra el modal cuando tocas el corazón
              btnfavorito(item.id);
            }}
          >
            <Text style={[styles.favoriteIcon, isItemFavorite && styles.favoriteActive]}>
              {isItemFavorite ? "❤️" : "🤍"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.productInfo}>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <View>
            <Text style={styles.deliveryText}>Dirección de envío</Text>
            <Text style={styles.addressText}> Cra 47 # 5e-30 </Text>
          </View>
        </View>
       
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Banner promocional */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Oferta especial{'\n'}hasta 50% de descuento
            </Text>
            <Pressable style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Comprar ahora</Text>
            </Pressable>
          </View>
        </View>

        {/* Best Seller Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Más vendidos del mes</Text>
        </View>

        {/* Products Grid */}
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#a4e635" />
            <Text style={{ marginTop: 10, color: '#666' }}>Cargando productos...</Text>
          </View>
        ) : filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
              {searchText ? `No se encontraron productos para "${searchText}"` : 'No hay productos disponibles'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Product Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeProductModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalles del producto</Text>
                  <TouchableOpacity onPress={closeProductModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Product Image */}
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                
                {/* Product Info */}
                <View style={styles.modalProductInfo}>
                  <View style={styles.modalRatingContainer}>
                    <Text style={styles.modalStar}>⭐</Text>
                    <Text style={styles.modalRating}>{selectedProduct.rating}</Text>
                  </View>
                  
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalProductPrice}>{selectedProduct.price}</Text>
                  
                  {/* Description (if available from API) */}
                  {selectedProduct.description && (
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                  )}
                  
                  {/* Action Buttons */}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={styles.favoriteModalButton} 
                      onPress={() => btnfavorito(selectedProduct.id)}
                    >
                      <Text style={styles.favoriteModalButtonText}>
                        {isFavorite(selectedProduct.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.addToCartButton}>
                      <Text style={styles.addToCartButtonText}>🛒 Agregar al carrito</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "white"
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8
  },
  deliveryText: {
    fontSize: 12,
    color: "#666"
  },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333"
  },
  headerIcons: {
    flexDirection: "row"
  },
  iconButton: {
    padding: 8,
    marginLeft: 4
  },
  icon: {
    fontSize: 20
  },
  scrollView: {
    flex: 1
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333"
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  banner: {
    backgroundColor: "#e8f4fd",
    borderRadius: 16,
    padding: 20,
    position: "relative",
    minHeight: 120
  },
  bannerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12
  },
  shopNowButton: {
    backgroundColor: "#a4e635",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  shopNowText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333"
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3
  },
  productImageContainer: {
    position: "relative",
    marginBottom: 8
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover"
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  favoriteIcon: {
    fontSize: 16
  },
  favoriteActive: {
    color: "#e74c3c"
  },
  productInfo: {
    gap: 4
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  star: {
    fontSize: 12,
    marginRight: 4
  },
  rating: {
    fontSize: 12,
    color: "#666"
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    lineHeight: 18
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 4
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8
  },
  navIcon: {
    fontSize: 24
  },
  navActive: {
    color: "#a4e635"
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 0,
    maxHeight: '90%',
    width: '90%',
    elevation: 5,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    backgroundColor: '#f9fafb',
  },
  modalProductInfo: {
    padding: 20,
  },
  modalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalStar: {
    fontSize: 16,
    marginRight: 6,
  },
  modalRating: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  modalProductPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtons: {
    gap: 12,
  },
  favoriteModalButton: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  favoriteModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#a4e635',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});