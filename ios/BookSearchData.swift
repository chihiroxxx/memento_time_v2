//
//  BookSearchData.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/26.
//

import Foundation
import UIKit


struct BookSearchItem: Identifiable {
    let id = UUID()
    let title: String
    let author: String
    let itemUrl: URL
    let imageUrl: URL
    let image: UIImage
}


class BookSearchData: ObservableObject {
    let urlEndpoint: String
    init(urlEndpoint: String){
        self.urlEndpoint = urlEndpoint
    }
    struct SearchResultJson: Codable {
        struct Item: Codable {
            let title: String?
            let author: String?
            let itemUrl: URL?
            let imageUrl: URL?

        }

        let items: [Item]?
    }
    @Published var bookSearchList: [BookSearchItem] = []

    func searchBook(keyword: String){
        print(keyword)

        guard let keyword_encode = keyword.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            return
        }
        guard let req_url = URL(string: backendUrl+"/\(urlEndpoint)?q=\(keyword_encode)&page=1") else {
            return
        }
        print(req_url)

        let req = URLRequest(url: req_url)
        let session = URLSession(configuration: .default, delegate: nil, delegateQueue: OperationQueue.main)
        let task = session.dataTask(with: req, completionHandler: {
            (data, response, error) in
            session.finishTasksAndInvalidate()
            do {
                let decoder = JSONDecoder()
                let json = try decoder.decode(SearchResultJson.self, from: data!)

                if let rsp_items = json.items {
                    self.bookSearchList.removeAll()
                    for rsp_item in rsp_items {
                        if let title = rsp_item.title,
                           let author = rsp_item.author,
                           let itemUrl = rsp_item.itemUrl,
                           let imageUrl = rsp_item.imageUrl,
                           let imageData = try? Data(contentsOf: imageUrl),
                           let image = UIImage(data: imageData)?.withRenderingMode(.alwaysOriginal){
                            let rsp_book = BookSearchItem(title: title, author: author, itemUrl: itemUrl, imageUrl: imageUrl, image: image)
                            self.bookSearchList.append(rsp_book)
                        }
                    }
                    print(self.bookSearchList)
                }
            } catch {
                print("jsonパースエラー！！")
            }
        })
        task.resume()
    }
    func resetBook(){
        self.bookSearchList.removeAll()
    }

}
