//
//  BookSearchDataRakuten.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/10/01.
//

import Foundation
import UIKit

class BookSearchDataRakuten: BookSearchData {
    struct SearchResultJson: Codable {
        struct RakutenItem: Codable {
            let Item: InItem
        }
        let Items: [RakutenItem]?
    }

    struct InItem: Codable {
        let title: String?
        let author: String?
        let itemUrl: URL?
        let largeImageUrl: URL?
    }



    override func searchBook(keyword: String){
        let rakutenAPIKey = "楽天のAPIキー！"

        guard let keyword_encode = keyword.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            return
        }


        guard let req_url = URL(string: "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=\(rakutenAPIKey)&keyword=\(keyword_encode)&page=1&format=json") else {
            return
        }
        let req = URLRequest(url: req_url)
        let session = URLSession.shared
        let task = session.dataTask(with: req, completionHandler: {
            (data, response, error) in
            session.finishTasksAndInvalidate()
            do {
                let decoder = JSONDecoder()
                let json = try decoder.decode(SearchResultJson.self, from: data!)

                if let rsp_items = json.Items {
                    self.bookSearchList.removeAll()
                    for rsp_item in rsp_items {
                        if let title = rsp_item.Item.title,
                           let author = rsp_item.Item.author,
                           let itemUrl = rsp_item.Item.itemUrl,
                           let imageUrl = rsp_item.Item.largeImageUrl,
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
}
