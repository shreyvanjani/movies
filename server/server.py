from flask import Flask, jsonify, make_response, request
import pandas as pd
import pickle
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Load files once at the start
try:
    movies_list = pd.read_pickle('../Data/movies1.pkl')
except Exception as e:
    movies_list = None
    print(f"Error loading files: {e}")

@app.route('/load_files', methods=['GET'])
def load_files():
    if movies_list is None:
        return make_response(jsonify({'error': 'Failed to load files on startup'}), 500)
    
    titles = movies_list['title'].tolist()
    return titles




@app.route('/movie', methods=['GET','POST'])
def recommend():
    try:
        selected_movie = request.form['selected_movie']
        similarity = pickle.load(open('../Data/similar.pkl', 'rb'))
    except Exception as e:
        return make_response(jsonify({'error': 'Failed to load data or process request'}), 500)

    if movies_list is None or similarity is None:
        return make_response(jsonify({'error': 'Failed to load files on startup'}), 500)

    movie_index = movies_list[movies_list['title'] == selected_movie].index[0]
    distances = similarity[movie_index]
    movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    recommend_list = []
    movies_poster = []
    for i in movie_list:
        movie_id = i[0]
        movie_data = movies_list.iloc[movie_id]
        recommend_list.append(movie_data['title'])
        movies_poster.append("https://image.tmdb.org/t/p/original" + movie_data['poster_path'])

    return jsonify(recommend_list=recommend_list, movies_poster=movies_poster)


# st.title('Movie Recommendation System')

# selected_movie = st.selectbox( 'select blue or Red Pill',movies)



# if st.button('Recommend Similar Movies' ):
#     names, posters = recommend(selected_movie)
#     columns = st.columns(5)

#     for i, (n, p) in enumerate(zip(names, posters)):
#         with columns[i % 5]:
#             st.header(n)
#             st.image(p)


# if __name__ == "__main__":
#     print("starting server")


if __name__ == '__main__':
    app.run(debug=True)
